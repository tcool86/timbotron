import Pyramid, { GameEntity } from 'pyramid-game-lib';
import { Entity } from 'pyramid-game-lib/dist/declarations/src/lib/Entities';
import { PyramidParamsBase } from 'pyramid-game-lib/dist/declarations/src/lib/Game';
import { Color } from 'three';
import {
	WoodBox,
	GrassGround,
	PlayerGoal,
	SpecialSphere,
	SimpleBox
} from './gameObjects';
const { Util } = Pyramid;
const { Vector3 } = Util;
const { Stage } = Pyramid;

@Stage({
	name: "stage 1",
	backgroundColor: new Color('#cce2cb')
})
export class TestStage implements GameEntity<Entity> { //TODO: should be stage

	async setup({ create, scene, world }: PyramidParamsBase<Entity>) {
		create(GrassGround);
		create(SimpleBox, { position: new Vector3(4, 4, 0) });
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 4; j++) {
				const positionVector = new Vector3((j * 5) - 10, 20 + (i * 10), -10);
				create(WoodBox, { position: positionVector });
			}
		}

		create(SpecialSphere);

		const trigger = await create(PlayerGoal, {
			onEnter: () => {
				if (!trigger.hasEntered) {
					console.log("entered trigger area");
					trigger.debugColor = 0xBADA55;
					trigger.hasEntered = true;
				}
			},
			onExit: () => {
				if (trigger.hasEntered) {
					console.log("entered trigger area");
					trigger.debugColor = 0x994409;
					trigger.hasEntered = false;
				}
			}
		});
		console.log(scene, world);
	}

	loop({ }: PyramidParamsBase<Entity>) { }
}