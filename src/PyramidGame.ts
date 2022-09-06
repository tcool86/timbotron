
import RAPIER from '@dimforge/rapier3d-compat';
import PryamidStage from './PyramidStage';
import Gamepad from './gamepad';
import PyramidPlayer from './PyramidPlayer';
import { Clock } from 'three';

class PyramidGame {
	stage?: PryamidStage;
	players: Map<number, PyramidPlayer>;
	gamepad: Gamepad;
	clock: any;
	ready: Promise<boolean>;

	constructor() {
		this.players = new Map();
		this.gamepad = new Gamepad();
		this.clock = new Clock();
		this.ready = new Promise((resolve, reject) => {
			const loadCollision = this.initializeGame();
			loadCollision.then((world) => {
				this.stage = new PryamidStage(world);

				const player = new PyramidPlayer(this.stage);
				this.players.set(1, player);

				const self = this;
				requestAnimationFrame(() => {
					self.gameLoop(self)
				});
				resolve(true);
			}).catch(error => {
				reject(error);
			});
		})
	}

	async gameLoop(self: PyramidGame) {
		// Process User Input
		const { horiz, vert, a, b } = self.gamepad.player1();
		let moveVector = new RAPIER.Vector3(
			horiz / 10,
			(a / 10) || -(b / 10),
			vert / 10,
		);
		const player = self.players.get(1);
		player?.move(moveVector);
		this.stage?.update();
		player?.update();

		// Render
		this.stage?.composer?.render();
		requestAnimationFrame(() => {
			self.gameLoop(self);
		});
	}

	async initializeGame() {
		await RAPIER.init();
		const world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

		return world;
	}

	domElement() {
		const element = this.stage?.renderer.domElement ?? document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
		return element;
	}
}

export default PyramidGame;
