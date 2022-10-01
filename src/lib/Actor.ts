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
		const { action, mixer, object } = payload;
		const position = object.position;
		this.createBody(position.setY(1));
		this.collisionSpherical(1.0);
		this.currentAction = action;
		this.mixer = mixer;
		this.object = object;
		this.currentAction.play();
		this.object.scale.set(1, 1, 1);
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
		this.object.position.set(translationVector.x, translationVector.y - 1, translationVector.z);
		this.object.rotation.set(rotationVector.x, rotationVector.y, rotationVector.z);
		this.mixer.update(delta);
		super.update(delta);
	}
}
