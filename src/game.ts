
import * as Three from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import RenderPixelatedPass from './rendering/RenderPixelatedPass';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import pyramid from './assets/pyramid.gltf?url';


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

const material = new Three.MeshNormalMaterial();
for (let i = 0; i < 2; i++) {
	const geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);

	const mesh = new Three.Mesh(geometry, material);
	mesh.position.x = (2 - i) * 0.25;
	scene.add(mesh);
}

new GLTFLoader().load(pyramid, function (gltf) {
	const pyramid = gltf.scene.children[0];

	pyramid.position.setY(0);
	pyramid.position.setX(0);
	pyramid.scale.set(0.01, 0.01, 0.01);

	scene.add(pyramid);
});

const clock = new Three.Clock();

function gameLoop() {
	// Process User Input
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