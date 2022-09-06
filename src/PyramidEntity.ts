import PyramidStage from "./PyramidStage";
import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

interface EntityOptions {
	size: THREE.Vector3;
	position: THREE.Vector3;
	rotation?: RAPIER.Rotation;
	fixed?: boolean;
}

export default class PryamidEntity {
	id: string;
	material: THREE.Material;
	geometry: THREE.BoxGeometry;
	mesh: THREE.Mesh;
	body: RAPIER.RigidBody;

	static instanceCounter = 0;

	constructor(
		stage: PyramidStage,
		{
			size,
			position,
			rotation = { x: 0, y: 0, z: 0, w: 0 },
			fixed = false
		}: EntityOptions) {
		const { world, scene } = stage;

		const rigidBodyFunction = (fixed) ? RAPIER.RigidBodyDesc.fixed() : RAPIER.RigidBodyDesc.dynamic();
		const rigidBodyDesc = rigidBodyFunction.setTranslation(position.x, position.y, position.z);
		rigidBodyDesc.setLinearDamping(10).setAngularDamping(10);

		let rigidBody = world.createRigidBody(rigidBodyDesc);
		rigidBody.setRotation(rotation, true);

		let colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
		world.createCollider(colliderDesc, rigidBody);

		const material = new THREE.MeshNormalMaterial();
		const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);

		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(position.x, position.y, position.z);
		scene.add(mesh);

		this.mesh = mesh;
		this.material = material;
		this.geometry = geometry;
		this.body = rigidBody;
		this.id = `e-${PryamidEntity.instanceCounter++}`;
	}

	update() {
		const translationVector: RAPIER.Vector = this.body.translation();
		const rotationVector: RAPIER.Rotation = this.body.rotation();
		this.mesh.position.set(translationVector.x, translationVector.y, translationVector.z);
		this.mesh.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);
	}


}