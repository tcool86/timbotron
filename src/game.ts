
import * as Three from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import RenderPixelatedPass from './rendering/RenderPixelatedPass';
import Gamepad from './gamepad';
import Player from './player';

let screenResolution = new Three.Vector2(window.innerWidth, window.innerHeight);
let renderResolution = screenResolution.clone().divideScalar(4);
renderResolution.x |= 0;
renderResolution.y |= 0;

let aspectRatio = screenResolution.x / screenResolution.y;

const camera = new Three.OrthographicCamera(-aspectRatio, aspectRatio, 1, -1, 0.1, 10);
camera.position.z = 1;

// TODO: Scenes can be game screens (i.e. Title, Main, etc.)
const scene = new Three.Scene();
scene.background = new Three.Color(0x5843c1);

const ambientLight = new Three.AmbientLight(0xffffff);
scene.add(ambientLight);

const material = new Three.MeshNormalMaterial();
for (let i = 0; i < 2; i++) {
	const geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);

	const mesh = new Three.Mesh(geometry, material);
	mesh.position.y = 0;
	mesh.position.x = (2 - i) * 0.25;
	scene.add(mesh);
}

const player = new Player(scene);
const gamepad = new Gamepad();


const clock = new Three.Clock();

function gameLoop() {
	// Process User Input
	const { horiz, vert, a, b } = gamepad.player1();

	player.mesh.position.x += horiz / 100;
	player.mesh.position.y -= vert / 100;
	player.mesh.position.z += a / 100;
	player.mesh.position.z -= b / 100;
	// Update
	const delta = clock.getDelta();
	scene.children.forEach(child => {
		child.rotation.y += delta;
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
camera.position.z = 2;
camera.position.y = 2 * Math.tan(Math.PI / 6);
controls.update();

requestAnimationFrame(gameLoop);

export const Game = renderer.domElement;

/**
 * Structure will look similar to Cocos2d
 * Pixel rendering built-in
 * Easy Gamepad support
 */