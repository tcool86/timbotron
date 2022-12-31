import Pyramid from "pyramid-game-lib";
import grassTest from './assets/grass.jpg?url';
import woodTest from './assets/wood-box.jpg?url';
import metalTest from './assets/metal-box.jpg?url';
const { Vector3, Vector2 } = Pyramid.Util;
const { Materials, Box, Sphere, Trigger } = Pyramid.Entity;

@Box({
	debugColor: 0xBADA55,
	showDebug: true,
	texturePath: woodTest,
	width: 2,
	height: 2,
	depth: 2
})
export class WoodBox {
	setup({ entity }: any) {
		console.log(`Entity: ${entity}`);
	}
}

@Box({
	showDebug: true,
	fixed: true,
	texturePath: grassTest,
	textureSize: new Vector2(8, 8),
	width: 100,
	height: 0.2,
	depth: 100
})
export class GrassGround { }

@Sphere({
	isSensor: true,
	color: 0xffff00,
	material: Materials.metal,
	texturePath: metalTest,
	position: new Vector3(0, -1000, 0),
	radius: 0.2
})
export class ProjectileSphere { }

@Box()
export class SimpleBox { }

@Sphere({
	color: 0xFF0000,
	material: Materials.metal,
	texturePath: metalTest,
	position: new Vector3(3, 2, -3),
	radius: 1
})
export class SpecialSphere {
	timer: number = 0;

	loop({ entity, delta }: any) {
		this.timer += delta;
		if (this.timer > 1) {
			entity.body.applyImpulse(new Vector3(0, 20, 0));
			this.timer = 0;
		}
	}
}

@Trigger({
	debugColor: 0x994409,
	showDebug: true,
	position: new Vector3(0, 3.5, -20),
	width: 30,
	height: 10,
	depth: 15,
})
export class PlayerGoal { }