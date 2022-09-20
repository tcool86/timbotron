import * as THREE from 'three';
import { Vector3 } from '@dimforge/rapier3d-compat';
import Entity from './Entity';
import Stage from './Stage';

export default class Actor extends Entity {

	constructor(stage: Stage) {
		const size = new THREE.Vector3(0.5, 0.5, 0.5);
		const position = new THREE.Vector3();
		super(stage, {
			size,
			position
		});
		return this;
	}

	move(moveVector: Vector3) {
		this.body.applyImpulse(moveVector, true);
		// this.body.addForce(moveVector, true);
	}

	update() {
		super.update();
	}
}
