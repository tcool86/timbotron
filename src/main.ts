import './style.css'
import Pyramid, { GameEntity } from 'pyramid-game-lib';
import Timbot from './player';
import { TestStage } from './stage';
import { TestStage2 } from './stage2';
import { Params } from 'pyramid-game-lib/dist/declarations/src/lib/Game';
import { Entity } from 'pyramid-game-lib/dist/declarations/src/lib/Entities';

const { Game, Globals } = Pyramid;

const globals = Globals.getInstance().setState({
	score: 0,
	player: { x: 0, z: 0 },
	stageCompleteCondition: false,
});

@Game({
	app: '#app',
	stages: [TestStage, TestStage2]
})
class Timbotron implements GameEntity<Entity> {
	async setup({ create, camera }: Params) {
		const player = await create(Timbot);
		camera.followEntity(player);
	}

	loop({ inputs, game }: Params) {
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

