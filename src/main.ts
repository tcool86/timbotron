import './style.css'
import Game from './Game';

const app = document.querySelector<HTMLDivElement>('#app')!;

const game = new Game();
game.ready.then(() => {
	app.appendChild(game.domElement());
})

class PyramidDebugElement extends HTMLElement {

}

window.customElements.define('pyramid-debug', PyramidDebugElement);
const debugElement = document.createElement('pyramid-debug');
app.appendChild(debugElement);

const test = <T>(data: T) => {
	return data;
}

console.log(test('generic type test'));
console.log(test({ 'Debug': Reflect.ownKeys(PyramidDebugElement) }));

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