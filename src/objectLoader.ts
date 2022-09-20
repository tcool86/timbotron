import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import textureTest from './assets/texture-test.png?url';
import test from './models/salsa.fbx?url';

export default function pixelTexture(texture: THREE.Texture) {
	texture.minFilter = THREE.NearestFilter;
	texture.magFilter = THREE.NearestFilter;
	texture.wrapS = THREE.ClampToEdgeWrapping;
	texture.wrapT = THREE.ClampToEdgeWrapping;
	texture.format = THREE.RGBFormat;
	texture.flipY = false;
	return texture;
}

export class EntityLoader {
	fbxLoader: FBXLoader;

	// Animation
	animationActions: THREE.AnimationAction[] = [];
	currentAnimation?: THREE.AnimationAction;
	lastAction?: THREE.AnimationAction;
	mixer?: THREE.AnimationMixer;

	constructor() {
		this.fbxLoader = new FBXLoader();
	}

	loadEntity(scene: THREE.Scene, children: Map<string, any>) {
		this.fbxLoader.load(
			test,
			(object) => {
				this.mixer = new THREE.AnimationMixer(object);
				const action: THREE.AnimationAction = this.mixer.clipAction(
					(object as THREE.Object3D).animations[0]
				);
				this.animationActions.push(action);
				this.currentAnimation = this.animationActions[0];
				object.userData = { hasAnimation: true, mixer: this.mixer };
				action.play();
				object.scale.set(0.2, 0.2, 0.2);
				object.position.set(0, -1, -1);
				scene.add(object);
				children.set('test-id', object);
			},
			(xhr) => {
				console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
			},
			(error) => {
				console.log(error)
			}
		)

	}
}
