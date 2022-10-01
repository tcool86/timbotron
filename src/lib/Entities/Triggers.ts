import * as THREE from 'three';
import Stage from '../Stage';
import { Vector3 } from '../Game';
import Entity from './Entity';

/**
 * Functions for creating primitive geometries easily
 * easily create an object with collision and a texture
 * 
 */

export interface TriggerOptions {
	debugColor?: number;
	width?: number;
	height?: number;
	depth?: number;
	position?: Vector3;
	x?: number;
	y?: number;
	z?: number;
	action: Function;
	exitAction: Function;
}

export function createAreaTrigger(options: TriggerOptions, stage: Stage) {
	const { width, height, depth } = options;
	const position = options?.position || new THREE.Vector3(0, 0, 0);
	const entity = new Entity(stage, 'test');
	const size = new THREE.Vector3(width, height, depth);
	const color = options?.debugColor || 0xFFFFFF;
	const geometry = new THREE.BoxGeometry(width, height, depth);
	entity.createDebugMesh(geometry, position, color);
	entity.createBody(position);
	entity.collisionRectangular(size, true);
	entity.collisionStatic();
	entity.showDebug = true;
	entity.action = options.action;
	entity.exitAction = options.exitAction;
	stage.children.set(entity.id, entity);
	return entity;
}

export function Triggers(stage: Stage) {
	return {
		createAreaTrigger: (options: TriggerOptions) => {
			return createAreaTrigger(options, stage)
		},
	}
}