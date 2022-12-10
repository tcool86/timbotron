import './style.css'
import Pyramid from 'pyramid-game-lib';
import grassTest from './assets/grass.jpg?url';
import metalTest from './assets/metal-box.jpg?url';
import woodTest from './assets/wood-box.jpg?url';
import idle from './models/idle.fbx?url';
import run from './models/run.fbx?url';

const app = document.querySelector<HTMLDivElement>('#app')!;

const { Game, Globals, Util } = Pyramid;
const { Vector3, Vector2 } = Util;

const globals = new Globals({
	score: 0,
	player: { x: 0, z: 0 }
});

const ammo: any = [];
let currentShot = 0;
let lastMovement = new Vector3();

let avatar: { animate: (arg0: number) => void; };
const projectileSphere = (mat: any) => {
	return {
		isSensor: true,
		color: 0xffff00,
		material: mat,
		texturePath: metalTest,
		position: new Vector3(0, -1000, 0),
		radius: 0.2
	}
}

const game = new Game({
	setup: async ({ primitives, materials, triggers, loaders }: any) => {
		const { createBox, createSphere } = primitives;
		const { createAreaTrigger } = triggers;
		const { createActor } = loaders;
		const { metal } = materials;

		// Box
		for (let i = 0; i < 100; i++) {
			let x = (i > 50) ? i - 50 : -i;
			createBox({
				debugColor: 0xBADA55,
				showDebug: true,
				texturePath: woodTest,
				position: new Vector3(x, (i * 3), x / 3),
				width: 2,
				height: 2,
				depth: 2
			});

		}
		// Sphere
		createSphere({
			color: 0xFF9999,
			material: metal,
			texturePath: metalTest,
			position: new Vector3(-3, 0.5, 10),
			radius: 1.0
		});
		ammo.push(
			createSphere(projectileSphere(metal)),
			createSphere(projectileSphere(metal)),
			createSphere(projectileSphere(metal)),
		);
		// Ground
		createBox({
			showDebug: true,
			fixed: true,
			texturePath: grassTest,
			textureSize: new Vector2(8, 8),
			width: 100,
			height: 0.2,
			depth: 100
		});
		let boxTrigger = createAreaTrigger({
			debugColor: 0x994409,
			showDebug: true,
			position: new Vector3(0, 3.5, -20),
			width: 30,
			height: 10,
			depth: 15,
			action: () => {
				if (!boxTrigger.enteredTrigger) {
					console.log("entered trigger area");
					boxTrigger.debugColor = 0xBADA55;
					boxTrigger.enteredTrigger = true;
				}
			},
			exitAction: () => {
				if (boxTrigger.enteredTrigger) {
					console.log("left trigger area");
					boxTrigger.debugColor = 0x994409;
					boxTrigger.enteredTrigger = false;
				}
			}
		});
		avatar = await createActor({
			files: [idle, run]
		})
	},
	loop: ({ inputs, player }) => {
		const { horizontal, vertical, buttonA, buttonB } = inputs[0];
		let movement = new Vector3();
		movement.setX(horizontal * 10);
		movement.setZ(vertical * 10);

		player.move(movement);
		if (avatar) {
			if (Math.abs(movement.x) > 0.2 || Math.abs(movement.z) > 0.2) {
				console.log('should switch animations');
				lastMovement = movement;
				player.rotateInDirection(movement);
				avatar.animate(1);
			} else {
				player.rotateInDirection(lastMovement);
				avatar.animate(0);
			}
		}
		// globals.update(
		// 	{
		// 		player: {
		// 			x: player.object.position.x,
		// 			z: player.object.position.z,
		// 		}
		// 	}
		// );
		if (buttonA) {
			console.log("A Pressed");
			const normalizeMovement = lastMovement.normalize();
			const multiplyMovement = normalizeMovement.multiply(new Vector3(200, 200, 200));
			ammo[currentShot].body.setTranslation(new Vector3(player.object.position.x, 3, player.object.position.z));
			ammo[currentShot].body.setLinvel(multiplyMovement, true);
			currentShot++;
			currentShot = currentShot % 3;
		}
		if (buttonB) {
			console.log("B Pressed");
		}
	}
});
game.ready.then(() => {
	console.log(globals.current());
	app.appendChild(game.domElement());
});
