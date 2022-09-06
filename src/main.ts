import './style.css'
import PyramidGame from './PyramidGame';

const app = document.querySelector<HTMLDivElement>('#app')!;

const game = new PyramidGame();
game.ready.then(() => {
	app.appendChild(game.domElement());
})
