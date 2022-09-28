import * as THREE from 'three';
import { Vector3, Rotation, RigidBodyType } from '@dimforge/rapier3d-compat';
import Entity from './Entities/Entity';
import Stage from './Stage';
import { ActorPayload } from './ActorLoader';

export default class Actor extends Entity {
	object: THREE.Group;
	animationActions: THREE.AnimationAction[] = [];
	currentAction?: THREE.AnimationAction;
	mixer: THREE.AnimationMixer;

	constructor(stage: Stage, payload: ActorPayload) {
		super(stage, 'player-test');
		this.createBody();
		this.collisionSpherical(1.0);
		this.currentAction = payload.action;
		this.mixer = payload.mixer;
		this.object = payload.object;
		this.currentAction.play();
		this.object.scale.set(0.5, 0.5, 0.5);
		this.body.lockRotations(true, true);
		this.body.setAdditionalMass(100, true);
		this.body.setBodyType(RigidBodyType.KinematicVelocityBased);
		stage.scene.add(this.object);
		this.id = 'test-id';
		return this;
	}

	move(moveVector: Vector3) {
		// this.body.applyImpulse(moveVector, true);
		this.body.setLinvel(moveVector, true);
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
