import * as THREE from 'three';
import { Vector3, Rotation } from '@dimforge/rapier3d-compat';
import Entity from './Entity';
import Stage from './Stage';
import { ActorPayload } from './ActorLoader';

export default class Actor extends Entity {
	object: THREE.Group;
	animationActions: THREE.AnimationAction[] = [];
	currentAction?: THREE.AnimationAction;
	mixer: THREE.AnimationMixer;

	constructor(stage: Stage, payload: ActorPayload) {
		const size = new THREE.Vector3(0.5, 0.5, 0.5);
		const position = new THREE.Vector3(3, 0, 0);
		super(stage, {
			size,
			position,
			hasMesh: false,
			tag: 'player-test'
		});
		this.currentAction = payload.action;
		this.mixer = payload.mixer;
		this.object = payload.object;
		this.currentAction.play();
		this.object.scale.set(0.4, 0.4, 0.4);
		this.body.lockRotations(true, true);
		this.body.setAdditionalMass(1, true);
		stage.scene.add(this.object);
		this.id = 'test-id';
		return this;
	}

	move(moveVector: Vector3) {
		this.body.applyImpulse(moveVector, true);
	}

	update(delta: number) {
		const translationVector: Vector3 = this.body.translation();
		const rotationVector: Rotation = this.body.rotation();
		this.object.position.set(translationVector.x, translationVector.y, translationVector.z);
		this.object.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);
		this.mixer.update(delta);
		super.update(delta);
	}
}
