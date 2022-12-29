import './style.css'
import Pyramid from 'pyramid-game-lib';
import Timbot from './player';
import {
	WoodBox,
	ProjectileSphere,
	GrassGround,
	PlayerGoal,
	SpecialSphere
} from './gameObjects';

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

	async setup({ commands }: any) {
		const { create } = await commands;

		create(GrassGround);
		for (let i = 0; i < 30; i++) {
			let x = (i > 15) ? i - 20 : -i;
			const positionVector = new Vector3(2 + x, 3 + i, 5);
			create(WoodBox, { position: positionVector });
		}
		this.ammo.push(
			await create(ProjectileSphere),
			await create(ProjectileSphere),
			await create(ProjectileSphere),
		);

		create(SpecialSphere);

		const trigger = await create(PlayerGoal, {
			onEnter: () => {
				if (!trigger.hasEntered) {
					console.log("entered trigger area");
					trigger.debugColor = 0xBADA55;
					trigger.hasEntered = true;
				}
			},
			onExit: () => {
				if (trigger.hasEntered) {
					console.log("entered trigger area");
					trigger.debugColor = 0x994409;
					trigger.hasEntered = false;
				}
			}
		})
		this.avatar = await create(Timbot);
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

