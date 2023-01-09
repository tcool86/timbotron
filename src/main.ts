import './style.css'
import Pyramid from 'pyramid-game-lib';
import Timbot from './player';
import {
	WoodBox,
	GrassGround,
	PlayerGoal,
	SpecialSphere,
	SimpleBox
} from './gameObjects';

const app = document.querySelector<HTMLDivElement>('#app')!;

const { Game, Globals, Util } = Pyramid;
const { Vector3 } = Util;

const globals = new Globals({
	score: 0,
	player: { x: 0, z: 0 }
});

@Game({ app, globals })
class Timbotron {
	async setup({ commands }: any) {
		const { create } = await commands;

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
		create(Timbot);
	}

	loop({ inputs, game }: any) {
		const { buttonB, buttonA } = inputs[0];
		if (buttonB) {
			game.pause = true;
		}
		if (buttonA) {
			game.pause = false;
		}
	}

	ready() {
		console.log(globals);
	}
}

new Timbotron();

