import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import Stage from '../Stage';
import { Vector3 } from '../Game';
import Entity from './Entity';

/**
 * Functions for creating primitive geometries easily
 * easily create an object with collision and a texture
 * 
 */

export interface PrimitiveOptions {
	material?: THREE.Material;
	texture?: string;
	color?: number;
	width?: number;
	height?: number;
	depth?: number;
	size?: Vector3;
	radius?: number;
	position: Vector3;
	x?: number;
	y?: number;
	z?: number;
	fixed?: boolean;
}

export function createBox(options: PrimitiveOptions, stage: Stage) {
	const { width, height, depth } = options;

	const entity = new Entity(stage, 'test');
	const size = new THREE.Vector3(width, height, depth);
	entity.rectangularMesh(size, options.position);
	entity.createBody();
	entity.collisionRectangular(size);
	entity.body.setAdditionalMass(0.02, true);
	entity.body.setAngularDamping(0.1);
	stage.children.set(entity.id, entity);
	return entity;
}

export function createSphere(options: PrimitiveOptions, stage: Stage) {
	const radius = options.radius ?? 1;
	const entity = new Entity(stage, 'test');
	entity.sphericalMesh(radius, options.position);
	entity.createBody();
	entity.collisionSpherical(radius);
	entity.body.setAdditionalMass(0.02, true);
	entity.body.setAngularDamping(0.1);
	stage.children.set(entity.id, entity);
	return entity;
}

export function Primitives(stage: Stage) {
	return {
		createBox: (options: PrimitiveOptions) => {
			return createBox(options, stage)
		},
		createSphere: (options: PrimitiveOptions) => {
			return createSphere(options, stage);
		}
	}
}