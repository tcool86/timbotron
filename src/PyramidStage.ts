import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import RenderPixelatedPass from './rendering/RenderPixelatedPass';
import PryamidEntity from './PyramidEntity';

export default class PryamidStage {
	world: RAPIER.World;
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;
	composer: EffectComposer;
	children: Map<string, PryamidEntity>;
	ground: PryamidEntity;

	constructor(world: RAPIER.World) {
		const scene = new THREE.Scene();
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

		const renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setSize(screenResolution.x, screenResolution.y);

		const composer = new EffectComposer(renderer);
		composer.addPass(new RenderPixelatedPass(renderResolution, scene, camera));

		const controls = new OrbitControls(camera, renderer.domElement)
		controls.target.set(0, 0, 0);
		camera.position.z = 6;
		camera.position.y = 2 * Math.tan(Math.PI / 3);
		camera.position.x = 2 * Math.tan(Math.PI / 3);
		controls.update();

		this.renderer = renderer;
		this.composer = composer;
		this.scene = scene;
		this.world = world;
		this.children = new Map();
		this.ground = new PryamidEntity(this, {
			size: new THREE.Vector3(10.0, 0.01, 10.0),
			position: new THREE.Vector3(0, -1, 0),
			fixed: true,
		});
		this.setupEntities();
	}

	update() {
		this.world.step();
		const entityIterator = this.children.entries();
		let entityWrapper;
		while (entityWrapper = entityIterator.next().value) {
			const [id, entity] = entityWrapper;
			entity.update();
		}
	}

	// TODO: Temporary
	setupEntities() {
		for (let i = 0; i < 2; i++) {
			const startX = (2 - i) * 0.33;
			const position = new THREE.Vector3(startX, 1.0, 0.0);
			const size = new THREE.Vector3(1.5, 0.5, 0.5);
			const entity = new PryamidEntity(this, {
				size,
				position
			})
			this.children.set(entity.id, entity);
		}
	}

}