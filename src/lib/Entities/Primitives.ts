import * as THREE from 'three';

/**
 * Functions for creating primitive geometries easily
 */

interface EntityOption {
	material?: THREE.Material;
	color?: THREE.Color;
	width?: number;
	height?: number;
	depth?: number;
	size?: THREE.Vector3;
	position?: THREE.Vector3;
	x?: number;
	y?: number;
	z?: number;
	fixed?: boolean;
}

export function createRectangleEntity(options: EntityOption) {
	console.log(options);
}

export function createSphereEntity() { }