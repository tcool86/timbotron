import Pyramid from 'pyramid-game-lib';
import grassTest from './assets/grass.jpg?url';
import metalTest from './assets/metal-box.jpg?url';
import woodTest from './assets/wood-box.jpg?url';

const { Vector3, Vector2 } = Pyramid.Util;

export const projectileSphere = (mat: any) => {
	return {
		isSensor: true,
		color: 0xffff00,
		material: mat,
		texturePath: metalTest,
		position: new Vector3(0, -1000, 0),
		radius: 0.2
	}
}

export const woodBox = (x: number, i: number) => {
	return {
		debugColor: 0xBADA55,
		showDebug: true,
		texturePath: woodTest,
		position: new Vector3(x, (i * 3), x / 3),
		width: 2,
		height: 2,
		depth: 2
	};
}

export const metalBall = (mat: any) => {
	return {
		color: 0xFF9999,
		material: mat,
		texturePath: metalTest,
		position: new Vector3(-3, 0.5, 10),
		radius: 1.0
	}
}

export const grassGround = () => {
	return {
		showDebug: true,
		fixed: true,
		texturePath: grassTest,
		textureSize: new Vector2(8, 8),
		width: 100,
		height: 0.2,
		depth: 100
	}
};

export const playerAreaTrigger = (enter: Function, exit: Function) => {
	return {
		debugColor: 0x994409,
		showDebug: true,
		position: new Vector3(0, 3.5, -20),
		width: 30,
		height: 10,
		depth: 15,
		action: enter,
		exitAction: exit
	}
}
