import './style.css'
import Pyramid, { LoopInjections } from './index';
import RAPIER from '@dimforge/rapier3d-compat';

const app = document.querySelector<HTMLDivElement>('#app')!;

const { Game, Globals } = Pyramid();

const globals = new Globals({
	score: 0,
	player: { x: 0, z: 0 }
})

const game = new Game({
	loop: ({ inputs, player }: LoopInjections) => {
		const { horizontal, vertical, buttonA, buttonB } = inputs[0];
		let moveVector = new RAPIER.Vector3(
			horizontal * 10,
			(buttonA) || -(buttonB),
			vertical * 10,
		);
		player.move(moveVector);
		globals.update(
			{
				player: {
					x: player.object.position.x,
					z: player.object.position.z,
				}
			}
		);
		if (buttonA) {
			console.log(globals.current());
		}
	}
});
game.ready.then(() => {
	console.log(globals.current());
	app.appendChild(game.domElement());
})

/**
	import { Game, Stage, Entity, MapLoader } from 'pyramid';

	const stage = new Stage({
		...options
	});

	const entity = new Entity({
		...options
	});

	stage.add(entity);

	Game.loop(({ input, stages, entities }) => {
		const { p1 } = input;
		const playerEntity = entities.getPlayer1();
		if (p1.up > 0.5) {
			playerEntity.moveX(5);
		}else if (p1.down > 0.5) {
			playerEntity.moveX(-5);
		}
	});

	playerEntity.collision('spike', ({entity, spike}) => {
		
	})

 */