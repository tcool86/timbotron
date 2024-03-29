import Pyramid, { GameEntity } from "pyramid-game-lib";
import grassTest from './assets/grass.jpg?url';
import woodTest from './assets/wood-box.jpg?url';
import metalTest from './assets/metal-box.jpg?url';
import { PyramidParamsBase } from "pyramid-game-lib/dist/declarations/src/lib/Game";
import { Entity } from "pyramid-game-lib/dist/declarations/src/lib/Entities";
import { TriggerEntity } from "pyramid-game-lib/dist/declarations/src/lib/Entities/Triggers";
const { Vector3, Vector2 } = Pyramid.Util;
const { Materials, Box, Sphere, Trigger, Collision } = Pyramid.Entity;

export const testCollisionKey = 'test_collision';

interface DestructibleBox {
	health: number;
}

@Box({
	debugColor: 0xBADA55,
	showDebug: true,
	texturePath: woodTest,
	width: 2,
	height: 2,
	depth: 2,
	collisionKey: testCollisionKey
})
export class WoodBox implements GameEntity<Entity>, DestructibleBox {
	health = 1;
	destroyed = false;

	setup({ entity }: PyramidParamsBase<Entity>) {
		console.log(`Entity: ${entity}`);
	}
	loop({ entity }: PyramidParamsBase<Entity>) {
		if (this.health < 0 && !this.destroyed) {
			this.destroyed = true;
			entity.body.setAngvel(new Vector3(1000, 0, 0), true);
			entity.body.applyImpulse(new Vector3(0, 5, 0), true);
		}
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
	radius: 0.2,
	collisionKey: 'bullet',
	glow: true
})
export class Bullet {

	@Collision(testCollisionKey)
	bulletCollidesTest({ target }: any) {
		const { _ref } = target;
		const health = (_ref as DestructibleBox).health ?? 0;
		(_ref as DestructibleBox).health = health - 1;
		target.debugColor = 0xFF0000;
	}
}

@Box()
export class SimpleBox { }

@Sphere({
	color: 0xFF0000,
	material: Materials.metal,
	texturePath: metalTest,
	position: new Vector3(3, 2, -3),
	radius: 1,
	glow: true
})
export class SpecialSphere implements GameEntity<Entity> {
	loop({ entity, frame }: PyramidParamsBase<Entity>) {
		frame(1, () => {
			entity.body.applyImpulse(new Vector3(0, 20, 0), true);
		});
	}

	setup({ }: PyramidParamsBase<Entity>) { }
}

@Trigger({
	debugColor: 0x994409,
	showDebug: true,
	position: new Vector3(0, 3.5, -20),
	width: 30,
	height: 10,
	depth: 15,
})
export class PlayerGoal implements GameEntity<TriggerEntity> {
	loop({ }: PyramidParamsBase<TriggerEntity>) {
		// const entered = entity.hasEntered;
		// const completion = globals.score >= 100;
		// if (entered && completion) {
		// 	globals.stageCompleteCondition = true;
		// }
	}

	setup({ }: PyramidParamsBase<Entity>) { }
}