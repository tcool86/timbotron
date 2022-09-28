import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import RenderPass from './rendering/RenderPixelatedPass';
import RenderPass from './rendering/RenderPass';
import { ActorLoader } from './ActorLoader';
import Entity from './Entities/Entity';
import Actor from './Actor';

export default class Stage {
	world: RAPIER.World;
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;
	composer: EffectComposer;
	children: Map<string, Entity>;
	players?: Map<string, Actor>;
	ground: Entity;

	constructor(world: RAPIER.World) {
		const scene = new THREE.Scene();
		let screenResolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
		let renderResolution = screenResolution.clone().divideScalar(4);
		renderResolution.x |= 0;
		renderResolution.y |= 0;

		let aspectRatio = screenResolution.x / screenResolution.y;

		const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
		camera.position.z = 20;
		camera.position.y = 6 * Math.tan(Math.PI / 3);

		scene.background = new THREE.Color(0x5843c1);

		const ambientLight = new THREE.AmbientLight(0xffffff);
		scene.add(ambientLight);

		const pointLight = new THREE.PointLight(0xFFF, 5.0, 50.0);
		pointLight.position.set(0, -1, 0);
		scene.add(pointLight);

		const renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setSize(screenResolution.x, screenResolution.y);

		const composer = new EffectComposer(renderer);
		composer.addPass(new RenderPass(renderResolution, scene, camera));

		const controls = new OrbitControls(camera, renderer.domElement)
		controls.target.set(0, 0, 0);
		controls.update();

		this.renderer = renderer;
		this.composer = composer;
		this.scene = scene;
		this.world = world;
		this.children = new Map();
		this.ground = new Entity(this, 'ground');
		const groundSize = new THREE.Vector3(100, 1, 100);
		this.ground.applyTexture();
		this.ground.rectangularMesh(groundSize, new THREE.Vector3(0, 0, 0));
		this.ground.createBody();
		this.ground.collisionRectangular(groundSize);
		this.ground.collisionStatic();
	}

	update(delta: number) {
		this.world.step();
		const entityIterator = this.children.entries();
		let entityWrapper;
		while (entityWrapper = entityIterator.next().value) {
			const [, entity] = entityWrapper;
			entity.update(delta);
		}
	}

	render() {
		this.composer.render();
	}

	getPlayer() {
		// return player node
		return this.children.get('test-id');
	}

	// TODO: Temporary
	async setupEntities() {
		const loader = new ActorLoader();
		const actorPayload = await loader.load('');
		const player = new Actor(this, actorPayload);
		this.children.set(player.id, player);
	}

}