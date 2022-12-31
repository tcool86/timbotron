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
		for (let i = 0; i < 30; i++) {
			let x = (i > 15) ? i - 20 : -i;
			const positionVector = new Vector3(2 + x, 3 + i, 5);
			create(WoodBox, { position: positionVector });
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

	loop() { }

	ready() {
		console.log(globals);
	}
}

new Timbotron();

