import Game from './lib/Game';
import Actor from './lib/Entities/Actor';
import Entity from './lib/Entities/Entity';
import Stage from './lib/Stage';
import Globals from './lib/Globals';
import { Vector3, Vector2 } from './lib/Util';

export type { LoopInterface } from './lib/Game';

export default function Pyramid() {
	return {
		Game,
		Vector3,
		Vector2,
		Actor,
		Stage,
		Entity,
		Globals
	};
}
