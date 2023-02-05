import './style.css'
import Pyramid from 'pyramid-game-lib';
import Timbot from './player';
import { TestStage } from './stage';

const { Game, Globals } = Pyramid;

const globals = Globals.getInstance().setState({
	score: 0,
	player: { x: 0, z: 0 }
});

@Game({
	app: '#app',
	stages: [TestStage]
})
class Timbotron {
	async setup({ commands, camera }: any) {
		const { create } = await commands;

		const player = await create(Timbot);
		camera.followEntity(player);
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

