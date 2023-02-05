import Pyramid from 'pyramid-game-lib';
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
export class TestStage {

	// TODO: expose scene and world objects
	async setup({ commands, scene, world }: any) {
		const { create } = commands;

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
		})
	}

	loop({ commands, scene, world }: any) {

	}
}