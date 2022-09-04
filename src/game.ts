
import * as Three from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import RenderPixelatedPass from './rendering/RenderPixelatedPass';
import Gamepad from './gamepad';
import Player from './player';
import RAPIER from '@dimforge/rapier3d-compat';

let world: RAPIER.World | null = null;
async function run_simulation() {
	await RAPIER.init();
	world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
	return world;
}

world = await run_simulation();
let groundColliderDesc = RAPIER.ColliderDesc.cuboid(5, 0.1, 5);
world.createCollider(groundColliderDesc);

let screenResolution = new Three.Vector2(window.innerWidth, window.innerHeight);
let renderResolution = screenResolution.clone().divideScalar(4);
renderResolution.x |= 0;
renderResolution.y |= 0;

let aspectRatio = screenResolution.x / screenResolution.y;

const camera = new Three.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 1, 100);
camera.position.z = 1;

// TODO: Scenes can be game screens (i.e. Title, Main, etc.)
const scene = new Three.Scene();
scene.background = new Three.Color(0x5843c1);

const ambientLight = new Three.AmbientLight(0xffffff);
scene.add(ambientLight);

const meshMap = new Map();
const material = new Three.MeshNormalMaterial();
for (let i = 0; i < 2; i++) {
	const geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
	const startX = (2 - i) * 0.33;
	let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(startX, 1.0, 0.0);
	let rigidBody = world.createRigidBody(rigidBodyDesc);
	let colliderDesc = RAPIER.ColliderDesc.cuboid(0.1, 0.1, 0.1);
	world.createCollider(colliderDesc, rigidBody);
	const mesh = new Three.Mesh(geometry, material);
	mesh.position.y = 0;
	mesh.position.x = startX;
	mesh.position.z = 0;
	meshMap.set(mesh, rigidBody);
	scene.add(mesh);
}

const geometry = new Three.BoxGeometry(5.0, 0.1, 5.0);
const groundMaterial = new Three.MeshBasicMaterial({ color: 0x52289B70, side: Three.DoubleSide });
const plane = new Three.Mesh(geometry, groundMaterial);
scene.add(plane);

let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 1.0, 0.0);
let rigidBody = world.createRigidBody(rigidBodyDesc);
let colliderDesc = RAPIER.ColliderDesc.cuboid(0.1, 0.1, 0.1);
world.createCollider(colliderDesc, rigidBody); // will return collider

const player = new Player(scene);
const gamepad = new Gamepad();

const clock = new Three.Clock();

const testMaterial = new Three.MeshNormalMaterial();
testMaterial.wireframe = true;
const testGeometry = new Three.BoxGeometry(0.15, 0.15, 0.15);
const testMesh = new Three.Mesh(testGeometry, testMaterial);
testMesh.position.set(1, 1, 1);
scene.add(testMesh);

async function gameLoop() {
	// Process User Input
	const { horiz, vert, a, b } = gamepad.player1();
	let moveVector = new RAPIER.Vector3(
		horiz / 1000,
		(a / 500) || -(b / 500),
		vert / 1000,
	);
	// player.mesh.position.x += horiz / 100;
	// player.mesh.position.y -= vert / 100;
	// player.mesh.position.z += a / 100;
	// player.mesh.position.z -= b / 100;

	rigidBody.applyImpulse(moveVector, true);
	const vector: RAPIER.Vector = rigidBody.translation();
	const rotationVector: RAPIER.Vector = rigidBody.rotation();
	player.mesh.position.set(vector.x, vector.y, vector.z);
	player.mesh.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);

	const groundVector: RAPIER.Vector = groundColliderDesc.translation;
	plane.position.set(groundVector.x, groundVector.y, groundVector.z);
	// Update
	const delta = clock.getDelta();
	testMesh.rotateY(delta);
	testMesh.rotateX(delta);
	world?.step();
	scene.children.forEach(child => {
		const rigidBody = meshMap.get(child);
		if (rigidBody) {
			const bodyVector = rigidBody.translation();
			const bodyRotation = rigidBody.rotation();
			child.position.set(bodyVector.x, bodyVector.y, bodyVector.z);
			child.rotation.set(bodyRotation.x, bodyRotation.y, bodyRotation.z);
		}
	});

	// Render
	composer.render();
	requestAnimationFrame(gameLoop);
}

const renderer = new Three.WebGLRenderer({ antialias: false });
renderer.setSize(screenResolution.x, screenResolution.y);

const composer: EffectComposer = new EffectComposer(renderer);
composer.addPass(new RenderPixelatedPass(renderResolution, scene, camera));

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 0);
camera.position.z = 6;
camera.position.y = 2 * Math.tan(Math.PI / 3);
camera.position.x = 2 * Math.tan(Math.PI / 3);
controls.update();

requestAnimationFrame(gameLoop);

export const Game = renderer.domElement;

/**
 * Structure will look similar to Cocos2d
 * Pixel rendering built-in
 * Easy Gamepad support
 */