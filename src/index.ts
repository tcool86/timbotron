import Game from './lib/Game';
import Actor from './lib/Actor';
import Entity from './lib/Entities/Entity';
import Stage from './lib/Stage';
import Globals from './lib/Globals';

export type { LoopInterface } from './lib/Game';

export default function Pyramid() {
	return {
		Game,
		Actor,
		Stage,
		Entity,
		Globals
	};
}
