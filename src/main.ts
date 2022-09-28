import './style.css'
import Pyramid, { LoopInterface } from './index';
import RAPIER from '@dimforge/rapier3d-compat';
import { SetupInterface } from './lib/Game';

const app = document.querySelector<HTMLDivElement>('#app')!;

const { Game, Globals } = Pyramid();

const globals = new Globals({
	score: 0,
	player: { x: 0, z: 0 }
})

const game = new Game({
	setup: ({ primitives, materials }: SetupInterface) => {
		const { createBox, createSphere } = primitives;
		const { metal } = materials;

		const box = createBox({
			color: 0x880000,
			texture: 'name',
			material: metal,
			position: new RAPIER.Vector3(-3, 0.5, 3),
			width: 2,
			height: 3,
			depth: 2
		});
		const sphere = createSphere({
			color: 0x880000,
			texture: 'name',
			material: metal,
			position: new RAPIER.Vector3(-3, 0.5, 10),
			radius: 2.0
		});
		console.log(box);
		console.log(sphere);
	},
	loop: ({ inputs, player }: LoopInterface) => {
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