import * as Three from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import textureTest from './assets/texture-test.png?url';
// import pyramid from './assets/pyramid.gltf?url';

export default function pixelTexture(texture: Three.Texture) {
	texture.minFilter = Three.NearestFilter;
	texture.magFilter = Three.NearestFilter;
	texture.wrapS = Three.ClampToEdgeWrapping;
	texture.wrapT = Three.ClampToEdgeWrapping;
	texture.format = Three.RGBFormat;
	// texture.offset.set(1, 1);
	texture.flipY = false;
	return texture;
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
