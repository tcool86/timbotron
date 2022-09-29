import Stage from "../Stage";
import { Vector3 } from '../Game';
import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { Vector2 } from "three";

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
	applyMaterial(texturePath: string | null, color: number, repeat: Vector2): void;
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
		this.mesh.castShadow = true;
		scene.add(this.mesh);
	}

	sphericalMesh(radius: number, position: Vector3) {
		const { scene } = this.stageRef;
		const geometry = new THREE.SphereGeometry(radius);
		this.mesh = new THREE.Mesh(geometry, this.material);
		this.mesh.position.set(position.x, position.y, position.z);
		this.mesh.castShadow = true;
		scene.add(this.mesh);
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

	applyMaterial(texturePath: string | null, color: number, repeat: Vector2) {
		let material;
		if (texturePath) {
			const loader = new THREE.TextureLoader();
			loader.setPath('');

			const texture = loader.load(texturePath);
			texture.repeat = repeat;
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			material = new THREE.MeshPhongMaterial({
				color: color,
				map: texture,
				// bumpMap: texture,
				// bumpScale: 0.3
			});
		} else {
			material = new THREE.MeshBasicMaterial({
				color: color,

			});
		}
		this.material = material;
	}

	update(_delta: number) {
		const translationVector: RAPIER.Vector = this.body.translation();
		const rotationVector: RAPIER.Rotation = this.body.rotation();
		this.mesh?.position.set(translationVector.x, translationVector.y, translationVector.z);
		this.mesh?.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);
	}


}