import Stage from "../Stage";
import imageTest from '../../assets/texture-test.png?url';
import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

interface EntityOptions {
	size: THREE.Vector3;
	position: THREE.Vector3;
	rotation?: RAPIER.Rotation;
	fixed?: boolean;
	hasMesh?: boolean;
	tag?: string;
}

export default class Entity {
	id: string;
	material?: THREE.Material;
	geometry?: THREE.BoxGeometry;
	mesh?: THREE.Mesh;
	body: RAPIER.RigidBody;
	tag: string;

	static instanceCounter = 0;

	constructor(
		stage: Stage,
		{
			size,
			position,
			rotation = { x: 0, y: 0, z: 0, w: 0 },
			fixed = false,
			tag = 'default',
			hasMesh = true,
		}: EntityOptions) {
		const { world, scene } = stage;

		const rigidBodyFunction = (fixed) ? RAPIER.RigidBodyDesc.fixed() : RAPIER.RigidBodyDesc.dynamic();
		const rigidBodyDesc = rigidBodyFunction.setTranslation(position.x, position.y, position.z);
		rigidBodyDesc.setLinearDamping(10).setAngularDamping(10);

		let rigidBody = world.createRigidBody(rigidBodyDesc);
		rigidBody.setRotation(rotation, true);

		let colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
		world.createCollider(colliderDesc, rigidBody);

		const path = imageTest.slice(0, 12);
		console.log(path);
		const textureName = (fixed) ? 'grass.jpg' : 'texture-test.png';
		const textureNormalName = (fixed) ? 'grass-normal.png' : 'texture-test.png';

		if (hasMesh) {
			const loader = new THREE.TextureLoader();
			loader.setPath(path);

			const textureCube = loader.load(textureName);
			const textureNormal = loader.load(textureNormalName);

			if (fixed) {
				textureCube.repeat = new THREE.Vector2(4.0, 4.0);
				textureCube.wrapS = THREE.RepeatWrapping;
				textureCube.wrapT = THREE.RepeatWrapping;
				textureNormal.repeat = new THREE.Vector2(4.0, 4.0);
				textureNormal.wrapS = THREE.RepeatWrapping;
				textureNormal.wrapT = THREE.RepeatWrapping;
			}
			const material = new THREE.MeshPhongMaterial({
				color: 0xffffff,
				map: textureCube,
				bumpMap: textureNormal,
				bumpScale: 2
			});

			const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);

			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(position.x, position.y, position.z);
			scene.add(mesh);
			this.mesh = mesh;
			this.material = material;
			this.geometry = geometry;
		}

		this.body = rigidBody;
		this.tag = tag;
		this.id = `e-${Entity.instanceCounter++}`;
	}

	update(_delta: number) {
		if (this.mesh) {
			const translationVector: RAPIER.Vector = this.body.translation();
			const rotationVector: RAPIER.Rotation = this.body.rotation();
			this.mesh.position.set(translationVector.x, translationVector.y, translationVector.z);
			this.mesh.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);
		}
	}


}