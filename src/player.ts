import Pyramid from "pyramid-game-lib";
import idle from './models/idle.fbx?url';
// import idle from './models/gangnam-style.fbx?url';
import run from './models/run.fbx?url';

const { Actor, Collision } = Pyramid.Entity;


@Actor({
	files: [idle, run]
})
class Timbot {

	constructor() {
		// initialize game specific vars
		// ammo? health?
	}

	setup() { }

	// loop({ input, actor, delta }: any) {
	// 	console.log(delta);
	// }

	@Collision('box')
	breakBox() {

	}
}

export default Timbot;