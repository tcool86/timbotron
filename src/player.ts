import Pyramid from "pyramid-game-lib";
import idle from './models/idle.fbx?url';
import gangnam from './models/gangnam-style.fbx?url';
import run from './models/run.fbx?url';
import { Bullet, testCollisionKey } from './gameObjects';
import { GameActor, PyramidParamsBase } from "pyramid-game-lib/dist/declarations/src/lib/Game";
import { PyramidActor } from "pyramid-game-lib/dist/declarations/src/lib/Entities/Actor";

const { Actor, Collision } = Pyramid.Entity;
const { Vector3 } = Pyramid.Util;

@Actor({
	files: [idle, run, gangnam],
})
class Timbot implements GameActor {
	ammo: any = [];
	currentShot: number = 0;
	lastMovement = new Vector3();
	boxCount = 0;

	async setup({ create }: PyramidParamsBase<PyramidActor>) {
		this.ammo.push(
			await create(Bullet),
			await create(Bullet),
			await create(Bullet),
		);
	}

	loop({ inputs, entity, globals }: PyramidParamsBase<PyramidActor>) {
		const { horizontal, vertical, buttonA, buttonB } = inputs[0];
		let movement = new Vector3();
		movement.setX(horizontal * 10);
		movement.setZ(vertical * 10);
		const isMoving = Math.abs(movement.x) > 3 || Math.abs(movement.z) > 3;
		const celebrate = this.boxCount >= 100;
		if (celebrate && !isMoving) {
			entity.animate(2);
		}
		if (!isMoving) {
			entity.move(new Vector3());
			entity.rotateInDirection(this.lastMovement);
		}
		if (entity?.animate) {
			if (isMoving) {
				entity.move(movement);
				this.lastMovement = movement;
				entity.rotateInDirection(movement);
				entity.animate(1);
			} else if (!celebrate) {
				entity.animate(0);
			}
		}
		if (buttonA) {
			const normalizeMovement = this.lastMovement.normalize();
			const multiplyMovement = normalizeMovement.multiply(new Vector3(200, 200, 200));
			this.ammo[this.currentShot].body.setTranslation(new Vector3(entity.object.position.x, 3, entity.object.position.z));
			this.ammo[this.currentShot].body.setLinvel(multiplyMovement, true);
			this.currentShot++;
			this.currentShot = this.currentShot % 3;
		}
		if (buttonB) {
			console.log("B Pressed");
			console.log(globals);
		}
	}

	@Collision(testCollisionKey)
	breakBox({ target }: any) {
		this.boxCount++;
		const progress = Math.round((this.boxCount / 100) * 100);
		const uiElement = document.getElementById('progress');
		if (uiElement) {
			uiElement.innerText = `${Math.min(progress, 100)}%`;
			if (progress >= 100) {
				uiElement.style.color = 'lightgreen'
			}
		}
		target.debugColor = 0x0000FF;
		target.body.applyImpulse(new Vector3(0, 5, 0));
	}
}

export default Timbot;