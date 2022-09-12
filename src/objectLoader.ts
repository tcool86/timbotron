import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import textureTest from './assets/texture-test.png?url';
import test from './models/running.fbx?url';

export default function pixelTexture(texture: THREE.Texture) {
	texture.minFilter = THREE.NearestFilter;
	texture.magFilter = THREE.NearestFilter;
	texture.wrapS = THREE.ClampToEdgeWrapping;
	texture.wrapT = THREE.ClampToEdgeWrapping;
	texture.format = THREE.RGBFormat;
	// texture.offset.set(1, 1);
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

// const textureLoader = new Three.TextureLoader();
// const pyramidTexture = pixelTexture(await textureLoader.loadAsync(textureTest));
// console.log(pyramidTexture);
// const pyramidMaterial = new Three.MeshBasicMaterial({
// 	map: pyramidTexture
// });

// new GLTFLoader().load(pyramid, function (gltf) {
// 	const pyramid = gltf.scene.children[0];

// 	pyramid.position.setY(0.5);
// 	pyramid.position.setX(-0.5);
// 	pyramid.scale.set(0.02, 0.02, 0.02);

// 	pyramid.children.forEach((group) => {
// 		group.children.forEach(child => {
// 			//@ts-ignore
// 			if (child.isMesh) {
// 				//@ts-ignore
// 				child.material = pyramidMaterial;
// 			}
// 		});
// 		//@ts-ignore
// 		// group.material.map = pyramidTexture;
// 	});

// 	scene.add(pyramid);
// });
