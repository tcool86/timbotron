import './style.css'
import PyramidGame from './PyramidGame';

const app = document.querySelector<HTMLDivElement>('#app')!;

const game = new PyramidGame();
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