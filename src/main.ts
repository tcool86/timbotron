import './style.css'
import Pyramid from 'pyramid-game-lib';
import {
	projectileSphere,
	woodBox,
	metalBall,
	grassGround,
	playerAreaTrigger,
} from './gameObject';
import Timbot from './player';

const app = document.querySelector<HTMLDivElement>('#app')!;

const { Game, Globals, Util } = Pyramid;
const { Vector3 } = Util;

const globals = new Globals({
	score: 0,
	player: { x: 0, z: 0 }
});

@Game(app)
class Timbotron {
	ammo: any;
	currentShot: number;
	lastMovement: any;
	avatar?: { animate: (animationKey: number) => void; }

	constructor() {
		this.ammo = [];
		this.currentShot = 0;
		this.lastMovement = new Vector3();
	}

	async setup({ commands, materials, loaders }: any) {
		const { createActor } = loaders;
		const { metal } = materials;
		const { create } = commands;
 
		// Box
		for (let i = 0; i < 100; i++) {
			let x = (i > 50) ? i - 50 : -i;
			create(woodBox(x, i));
		}
		// Sphere
		create(metalBall(metal));

		this.ammo.push(
			create(projectileSphere(metal)),
			create(projectileSphere(metal)),
			create(projectileSphere(metal)),
		);
		// Ground
		create(grassGround());
		let boxTrigger = create(playerAreaTrigger(() => {
			if (!boxTrigger.enteredTrigger) {
				console.log("entered trigger area");
				boxTrigger.debugColor = 0xBADA55;
				boxTrigger.enteredTrigger = true;
			}
		},() => {
			if (boxTrigger.enteredTrigger) {
				console.log("left trigger area");
				boxTrigger.debugColor = 0x994409;
				boxTrigger.enteredTrigger = false;
			}
		}));
		this.avatar = await createActor(Timbot);
	}

	loop({ inputs, player }: any) {
		const { horizontal, vertical, buttonA, buttonB } = inputs[0];
		let movement = new Vector3();
		movement.setX(horizontal * 10);
		movement.setZ(vertical * 10);

		player.move(movement);
		if (this.avatar?.animate) {
			if (Math.abs(movement.x) > 0.2 || Math.abs(movement.z) > 0.2) {
				this.lastMovement = movement;
				player.rotateInDirection(movement);
				this.avatar.animate(1);
			} else {
				player.rotateInDirection(this.lastMovement);
				this.avatar.animate(0);
			}
		}
		if (buttonA) {
			console.log("A Pressed");
			const normalizeMovement = this.lastMovement.normalize();
			const multiplyMovement = normalizeMovement.multiply(new Vector3(200, 200, 200));
			this.ammo[this.currentShot].body.setTranslation(new Vector3(player.object.position.x, 3, player.object.position.z));
			this.ammo[this.currentShot].body.setLinvel(multiplyMovement, true);
			this.currentShot++;
			this.currentShot = this.currentShot % 3;
		}
		if (buttonB) {
			console.log("B Pressed");
		}
	}

	ready() {
		console.log(globals);
	}
}

new Timbotron();

