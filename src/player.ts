import Pyramid from "pyramid-game-lib";
import idle from './models/idle.fbx?url';
// import idle from './models/gangnam-style.fbx?url';
import run from './models/run.fbx?url';
import { ProjectileSphere } from './gameObjects';

const { Actor, Collision } = Pyramid.Entity;
const { Vector3 } = Pyramid.Util;


@Actor({
	files: [idle, run],
})
class Timbot {
	ammo: any = [];
	currentShot: number = 0;
	lastMovement = new Vector3();

	async setup({ commands }: any) {
		const { create } = await commands;
		this.ammo.push(
			await create(ProjectileSphere),
			await create(ProjectileSphere),
			await create(ProjectileSphere),
		);
	}

	loop({ inputs, entity }: any) {
		const { horizontal, vertical, buttonA, buttonB } = inputs[0];
		let movement = new Vector3();
		movement.setX(horizontal * 10);
		movement.setZ(vertical * 10);

		if (entity?.animate) {
			if (Math.abs(movement.x) > 3 || Math.abs(movement.z) > 3) {
				entity.move(movement);
				this.lastMovement = movement;
				entity.rotateInDirection(movement);
				entity.animate(1);
			} else {
				entity.move(new Vector3());
				entity.rotateInDirection(this.lastMovement);
				entity.animate(0);
			}
		}
		if (buttonA) {
			console.log("A Pressed");
			const normalizeMovement = this.lastMovement.normalize();
			const multiplyMovement = normalizeMovement.multiply(new Vector3(200, 200, 200));
			this.ammo[this.currentShot].body.setTranslation(new Vector3(entity.object.position.x, 3, entity.object.position.z));
			this.ammo[this.currentShot].body.setLinvel(multiplyMovement, true);
			this.currentShot++;
			this.currentShot = this.currentShot % 3;
		}
		if (buttonB) {
			console.log("B Pressed");
		}
	}

	@Collision('box')
	breakBox() {

	}
}

export default Timbot;