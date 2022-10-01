import './style.css'
import Pyramid, { LoopInterface } from './index';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { SetupInterface } from './lib/Game';
import grassTest from './assets/grass.jpg?url';
import metalTest from './assets/metal-box.jpg?url';
import woodTest from './assets/wood-box.jpg?url';
import Entity from './lib/Entities/Entity';

const app = document.querySelector<HTMLDivElement>('#app')!;

const { Game, Globals } = Pyramid();

const globals = new Globals({
	score: 0,
	player: { x: 0, z: 0 }
})

const game = new Game({
	setup: ({ primitives, materials }: SetupInterface) => {
		const { createBox, createSphere } = primitives;
		const { metal } = materials;

		const box = createBox({
			texturePath: woodTest,
			position: new RAPIER.Vector3(-3, 0.5, 3),
			width: 2,
			height: 2,
			depth: 2
		});
		const sphere = createSphere({
			color: 0xFF9999,
			material: metal,
			texturePath: metalTest,
			position: new RAPIER.Vector3(-3, 0.5, 10),
			radius: 1.0
		});
		const ground = createBox({
			fixed: true,
			texturePath: grassTest,
			textureSize: new THREE.Vector2(8, 8),
			width: 100,
			height: 0.5,
			depth: 100
		});
		console.log(box);
		console.log(sphere);
		console.log(ground);
	},
	loop: ({ inputs, player, stage }: LoopInterface) => {
		const { world } = stage;
		const { horizontal, vertical, buttonA, buttonB } = inputs[0];
		let moveVector = new RAPIER.Vector3(
			horizontal * 10,
			(buttonA) || -(buttonB),
			vertical * 10,
		);
		player.move(moveVector);
		globals.update(
			{
				player: {
					x: player.object.position.x,
					z: player.object.position.z,
				}
			}
		);
		if (buttonA) {
			console.log(globals.current());
			console.log(world);
			console.log(player.body.collider);
		}
		world.contactsWith(player.body.collider(0), (otherCollider) => {
			const object = otherCollider.parent();
			const userData = object?.userData;
			if (!userData) {
				console.log('no user data on collider');
				return;
			}
			const { id } = userData ?? { id: null };
			if (id === null) {
				console.log('no id on collider');
				return;
			} else {
				const entity = stage.children.get(id) as Entity;
				const material = entity.debug?.material as THREE.MeshPhongMaterial;
				material.color?.set(0x009900);
			}
		})
	}
});
game.ready.then(() => {
	console.log(globals.current());
	app.appendChild(game.domElement());
})

/**
	import { Game, Stage, Entity, MapLoader } from 'pyramid';

	const stage = new Stage({
		...options
	});

	const entity = new Entity({
		...options
	});

	stage.add(entity);

	Game.loop(({ input, stages, entities }) => {
		const { p1 } = input;
		const playerEntity = entities.getPlayer1();
		if (p1.up > 0.5) {
			playerEntity.moveX(5);
		}else if (p1.down > 0.5) {
			playerEntity.moveX(-5);
		}
	});

	playerEntity.collision('spike', ({entity, spike}) => {
		
	})

 */