import './style.css'
import Game from './lib/Game';

const app = document.querySelector<HTMLDivElement>('#app')!;

let counter = 0;

const game = new Game({
	loop: (ticks: number) => {
		counter += ticks;
		if (counter > 2000) {
			counter = 0;
			console.log('looping');
		}
	}
});
game.ready.then(() => {
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