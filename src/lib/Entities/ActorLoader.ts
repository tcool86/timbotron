import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import run from '../models/run.fbx?url';
import idle from '../../models/hook.fbx?url';

export default function pixelTexture(texture: THREE.Texture) {
	texture.minFilter = THREE.NearestFilter;
	texture.magFilter = THREE.NearestFilter;
	texture.wrapS = THREE.ClampToEdgeWrapping;
	texture.wrapT = THREE.ClampToEdgeWrapping;
	texture.format = THREE.RGBFormat;
	texture.flipY = false;
	return texture;
}

export interface ActorPayload {
	object: THREE.Group;
	action: THREE.AnimationAction;
	mixer: THREE.AnimationMixer;
}

export class ActorLoader {
	fbxLoader: FBXLoader;

	constructor() {
		this.fbxLoader = new FBXLoader();
	}

	/**
	 * load
	 * loads fbx files for animating an actor entity
	 * @param directory 
	 */
	load(directory: string): Promise<ActorPayload> {
		console.log(`${directory} currently unused`);
		return new Promise((resolve, reject) => {
			return this.fbxLoader.load(
				idle, // replace with directory dynamic import
				(object) => {
					const mixer = new THREE.AnimationMixer(object);
					const action: THREE.AnimationAction = mixer.clipAction(
						(object as THREE.Object3D).animations[0]
					);
					action.play();
					const payload: ActorPayload = {
						object,
						action,
						mixer
					};
					resolve(payload);
				},
				(xhr) => {
					console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
				},
				(error) => {
					console.error(error);
					reject(error);
				}
			)
		});
	}
}
