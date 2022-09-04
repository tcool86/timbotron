
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import RenderPixelatedPass from './rendering/RenderPixelatedPass';
import Gamepad from './gamepad';
import Player from './player';

class Game {
	world: RAPIER.World | null;
	scene: THREE.Scene;
	// TODO: meshmap is temporary
	meshMap: Map<any, any>;
	players: Map<number, Player>;
	// TODO: change any types, will have CollisionMesh Object
	ground: any;
	groundColl: any;
	testMesh: any;
	gamepad: Gamepad;
	clock: any;
	camera: any;
	renderer: any;
	composer?: EffectComposer;
	ready: Promise<boolean>;

	constructor() {
		this.world = null;
		this.scene = new THREE.Scene();
		this.meshMap = new Map();
		this.players = new Map();
		this.gamepad = new Gamepad();
		this.ready = new Promise((resolve, reject) => {
			const loadCollision = this.initializeGame();
			loadCollision.then((world) => {
				this.setupMainScene(this.scene);
				this.setupEntities(world);
				const self = this;
				requestAnimationFrame(() => {
					self.gameLoop(self)
				});
				resolve(true);
			}).catch(error => {
				reject(error);
			});
		})
	}

	setupMainScene(scene: THREE.Scene) {
		let screenResolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
		let renderResolution = screenResolution.clone().divideScalar(4);
		renderResolution.x |= 0;
		renderResolution.y |= 0;

		let aspectRatio = screenResolution.x / screenResolution.y;

		const camera = new THREE.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 1, 100);
		camera.position.z = 1;

		scene.background = new THREE.Color(0x5843c1);

		const ambientLight = new THREE.AmbientLight(0xffffff);
		scene.add(ambientLight);

		this.renderer = new THREE.WebGLRenderer({ antialias: false });
		this.renderer.setSize(screenResolution.x, screenResolution.y);

		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPixelatedPass(renderResolution, scene, camera));

		const controls = new OrbitControls(camera, this.renderer.domElement)
		controls.target.set(0, 0, 0);
		camera.position.z = 6;
		camera.position.y = 2 * Math.tan(Math.PI / 3);
		camera.position.x = 2 * Math.tan(Math.PI / 3);
		controls.update();
	}

	setupEntities(world: RAPIER.World) {
		const material = new THREE.MeshNormalMaterial();
		for (let i = 0; i < 2; i++) {
			const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
			const startX = (2 - i) * 0.33;
			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.y = 0;
			mesh.position.x = startX;
			mesh.position.z = 0;
			this.scene.add(mesh);

			let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(startX, 1.0, 0.0);
			let rigidBody = world.createRigidBody(rigidBodyDesc);
			let colliderDesc = RAPIER.ColliderDesc.cuboid(0.1, 0.1, 0.1);
			world.createCollider(colliderDesc, rigidBody);
			this.meshMap.set(mesh, rigidBody);
		}

		const geometry = new THREE.BoxGeometry(5.0, 0.1, 5.0);
		const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x52289B70, side: THREE.DoubleSide });
		this.ground = new THREE.Mesh(geometry, groundMaterial);
		this.scene.add(this.ground);

		let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 1.0, 0.0);
		let rigidBody = world.createRigidBody(rigidBodyDesc);
		let colliderDesc = RAPIER.ColliderDesc.cuboid(0.1, 0.1, 0.1);
		this.groundColl = rigidBody;
		world.createCollider(colliderDesc, rigidBody); // will return collider

		const player = new Player(this.scene);
		player.body = rigidBody;
		this.players.set(1, player);

		this.clock = new THREE.Clock();

		const testMaterial = new THREE.MeshNormalMaterial();
		testMaterial.wireframe = true;
		const testGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
		this.testMesh = new THREE.Mesh(testGeometry, testMaterial);
		this.testMesh.position.set(1, 1, 1);
		this.scene.add(this.testMesh);
	}

	async gameLoop(self: Game) {
		// Process User Input
		const { horiz, vert, a, b } = self.gamepad.player1();
		let moveVector = new RAPIER.Vector3(
			horiz / 1000,
			(a / 500) || -(b / 500),
			vert / 1000,
		);
		const player = self.players.get(1);
		if (player) {
			player.body.applyImpulse(moveVector, true);
			const vector: RAPIER.Vector = player.body.translation();
			const rotationVector: RAPIER.Vector = player.body.rotation();
			player.mesh.position.set(vector.x, vector.y, vector.z);
			player.mesh.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);
		}

		const groundVector: RAPIER.Vector = self.groundColl.translation;
		self.ground.position.set(groundVector.x, groundVector.y, groundVector.z);
		// Update
		const delta = self.clock.getDelta();
		self.testMesh.rotateY(delta);
		self.testMesh.rotateX(delta);
		self.world?.step();
		self.scene.children.forEach(child => {
			const rigidBody = self.meshMap.get(child);
			if (rigidBody) {
				const bodyVector = rigidBody.translation();
				const bodyRotation = rigidBody.rotation();
				child.position.set(bodyVector.x, bodyVector.y, bodyVector.z);
				child.rotation.set(bodyRotation.x, bodyRotation.y, bodyRotation.z);
			}
		});

		// Render
		self.composer?.render();
		requestAnimationFrame(() => {
			self.gameLoop(self);
		});
	}

	async initializeGame() {
		await RAPIER.init();
		this.world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

		this.groundColl = RAPIER.ColliderDesc.cuboid(5, 0.1, 5);
		this.world.createCollider(this.groundColl);
		return this.world;
	}

	domElement() {
		return this.renderer.domElement;
	}
}

export default Game;

/**
 * Structure will look similar to Cocos2d
 * Pixel rendering built-in
 * Easy Gamepad support
 */