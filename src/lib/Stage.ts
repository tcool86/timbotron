import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import RenderPixelatedPass from './rendering/RenderPixelatedPass';
import { EntityLoader } from '../objectLoader';
import Entity from './Entity';
import Actor from './Actor';

export default class Stage {
	world: RAPIER.World;
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;
	composer: EffectComposer;
	children: Map<string, Entity>;
	players?: Map<string, Actor>;
	ground: Entity;
	clock: THREE.Clock;

	constructor(world: RAPIER.World) {
		const scene = new THREE.Scene();
		let screenResolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
		let renderResolution = screenResolution.clone().divideScalar(4);
		renderResolution.x |= 0;
		renderResolution.y |= 0;

		let aspectRatio = screenResolution.x / screenResolution.y;

		const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
		camera.position.z = 8;
		camera.position.y = 3 * Math.tan(Math.PI / 3);

		scene.background = new THREE.Color(0x5843c1);

		const ambientLight = new THREE.AmbientLight(0xffffff);
		scene.add(ambientLight);

		const renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setSize(screenResolution.x, screenResolution.y);

		const composer = new EffectComposer(renderer);
		composer.addPass(new RenderPixelatedPass(renderResolution, scene, camera));

		const controls = new OrbitControls(camera, renderer.domElement)
		controls.target.set(0, 0, 0);
		controls.update();

		this.renderer = renderer;
		this.composer = composer;
		this.scene = scene;
		this.world = world;
		this.children = new Map();
		this.ground = new Entity(this, {
			size: new THREE.Vector3(10.0, 0.01, 10.0),
			position: new THREE.Vector3(0, -1, 0),
			fixed: true,
		});
		this.clock = new THREE.Clock();
		this.setupEntities();
	}

	update() {
		this.world.step();
		const entityIterator = this.children.entries();
		let entityWrapper;
		while (entityWrapper = entityIterator.next().value) {
			const [, entity] = entityWrapper;
			if (entity.userData?.hasAnimation) {
				entity.userData?.mixer.update(this.clock.getDelta());
				continue;
			}
			entity.update();
		}
	}

	// TODO: Temporary
	setupEntities() {
		for (let i = 0; i < 2; i++) {
			const startX = (2 - i) * 0.33;
			const position = new THREE.Vector3(startX, 1.0, 0.0);
			const size = new THREE.Vector3(1.5, 0.5, 0.5);
			const entity = new Entity(this, {
				size,
				position
			})
			this.children.set(entity.id, entity);
		}
		const loader = new EntityLoader();
		loader.loadEntity(this.scene, this.children);
	}

}