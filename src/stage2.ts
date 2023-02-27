import Pyramid from 'pyramid-game-lib';
import { Color } from 'three';
import {
	WoodBox,
	GrassGround,
	PlayerGoal,
	SpecialSphere,
} from './gameObjects';
const { Stage } = Pyramid;

@Stage({
	name: "stage 2",
	backgroundColor: new Color('#eb9694')
})
export class TestStage2 {
	async setup({ commands, scene, world }: any) {
		const { create } = commands;

		create(GrassGround);
		create(WoodBox);
		create(SpecialSphere);
		create(SpecialSphere);
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

	loop({ }: any) {

	}
}