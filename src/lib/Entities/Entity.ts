import Stage from "../Stage";
import grassTest from '../../assets/grass.jpg?url';
import { Vector3 } from '../Game';
import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

export interface EntityBuilder {
	rectangularMesh(size: Vector3, position: Vector3): void;
	sphericalMesh(radius: number, position: Vector3): void;
	noMesh(): void;
	createBody(): void;
	collisionRectangular(size: Vector3): void;
	collisionSpherical(radius: number): void;
	collisionStatic(): void;
	setRotation(): void;
	enableDebug(): void;
	applyTexture(): void;
	applyMaterial(): void;
}

export default class Entity implements EntityBuilder {
	id: string;
	material?: THREE.Material;
	geometry?: THREE.BoxGeometry | THREE.SphereGeometry;
	mesh?: THREE.Mesh;
	body!: RAPIER.RigidBody;
	debug!: THREE.Mesh;
	stageRef: Stage;
	tag: string;

	static instanceCounter = 0;

	constructor(stage: Stage, tag: string) {
		this.stageRef = stage;
		this.tag = tag;
		this.id = `e-${Entity.instanceCounter++}`;
	}

	rectangularMesh(size: Vector3, position: Vector3) {
		const { scene } = this.stageRef;
		const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
		console.log(this.material);
		this.mesh = new THREE.Mesh(geometry, this.material);
		this.mesh.position.set(position.x, position.y, position.z);
		scene.add(this.mesh);
	}

	sphericalMesh(radius: number, position: Vector3) {
		const geometry = new THREE.SphereGeometry(radius);
		this.mesh = new THREE.Mesh(geometry);
		this.mesh.position.set(position.x, position.y, position.z);
	}

	noMesh() { }

	createBody(): void {
		const { world } = this.stageRef;
		const { x, y, z } = this.mesh?.position ?? { x: 0, y: 0, z: 0 };
		const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z);
		rigidBodyDesc.setLinearDamping(1.0).setAngularDamping(1.0);
		this.body = world.createRigidBody(rigidBodyDesc);
	}

	collisionRectangular(size: Vector3) {
		const { world } = this.stageRef;
		const half = { x: size.x / 2, y: size.y / 2, z: size.z / 2 };
		let colliderDesc = RAPIER.ColliderDesc.cuboid(half.x, half.y, half.z);

		world.createCollider(colliderDesc, this.body);
	}

	collisionSpherical(radius: number) {
		const { world } = this.stageRef;
		let colliderDesc = RAPIER.ColliderDesc.ball(radius);

		world.createCollider(colliderDesc, this.body);
	}

	collisionStatic() {
		this.body.setBodyType(RAPIER.RigidBodyType.Fixed);
	}

	setRotation(): void {
		const x = Number(this.mesh?.rotateX) ?? 0;
		const y = Number(this.mesh?.rotateY) ?? 0;
		const z = Number(this.mesh?.rotateZ) ?? 0;
		this.body.setRotation({ x, y, z, w: 0 }, true);
	}

	enableDebug() {

	}
	applyTexture() {
		const texture = grassTest;
		console.log(grassTest);
		const loader = new THREE.TextureLoader();
		loader.setPath('');

		const textureCube = loader.load(texture);
		textureCube.repeat = new THREE.Vector2(4.0, 4.0);
		textureCube.wrapS = THREE.RepeatWrapping;
		textureCube.wrapT = THREE.RepeatWrapping;
		const material = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			map: textureCube,
			// bumpMap: textureNormal,
			// bumpScale: 2
		});
		this.material = material;
	}
	applyMaterial() {

	}

	update(_delta: number) {
		const translationVector: RAPIER.Vector = this.body.translation();
		const rotationVector: RAPIER.Rotation = this.body.rotation();
		this.mesh?.position.set(translationVector.x, translationVector.y, translationVector.z);
		this.mesh?.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);
	}


}