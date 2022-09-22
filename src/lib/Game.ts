
import RAPIER from '@dimforge/rapier3d-compat';
import Stage from './Stage';
import { Menu } from './Menu';
import Gamepad from '../gamepad';

import { Clock } from 'three';

interface GameOptions {
	loop: (ticks: number) => void;
}

class Game {
	stages: Stage[] = [];
	currentStage: number = 0;
	menu?: Menu;
	loop: Function;
	gamepad: Gamepad;
	clock: any;
	ready: Promise<boolean>;

	constructor({ loop }: GameOptions) {
		this.gamepad = new Gamepad();
		this.clock = new Clock();
		this.loop = loop;
		this.ready = new Promise(async (resolve, reject) => {
			try {
				const world = await this.loadPhysics();
				this.stages.push(new Stage(world));

				const self = this;
				requestAnimationFrame(() => {
					self.gameLoop(self)
				});
				resolve(true);
			} catch (error) {
				reject(error);
			}
		});
	}

	async loadPhysics() {
		await RAPIER.init();
		const world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

		return world;
	}

	async gameLoop(self: Game) {
		// Process User Input
		// const { horiz, vert, a, b } = self.gamepad.player1();
		// let moveVector = new RAPIER.Vector3(
		// 	horiz / 10,
		// 	(a / 10) || -(b / 10),
		// 	vert / 10,
		// );
		this.stages[this.currentStage].update();

		const ticks = this.clock.getElapsedTime();
		this.loop(ticks);

		// Render
		this.stages[this.currentStage].composer?.render();
		requestAnimationFrame(() => {
			self.gameLoop(self);
		});
	}

	domElement() {
		const element = this.stages[this.currentStage].renderer.domElement ?? document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
		return element;
	}
}

export default Game;
