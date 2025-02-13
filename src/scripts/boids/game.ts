import { createWorld, query } from "bitecs";
import { type Sprite } from "pixi.js";

const MAX_ENTITIES = 10000;

export const world = createWorld({
	components: {
		Position: {
			x: new Float32Array(MAX_ENTITIES),
			y: new Float32Array(MAX_ENTITIES),
		},
		Rotation: {
			angle: new Float32Array(MAX_ENTITIES),
		},
		GameSprite: {
			sprite: [] as Sprite[],
		},
	},
	delta: 0,
});

type GameWorld = typeof world;

const { Position, Rotation, GameSprite } = world.components;

const moveEntity = (world: GameWorld) => {
	query(world, [Position, GameSprite]).forEach((eid) => {
		GameSprite.sprite[eid]!.x = Position.x[eid]!;
		GameSprite.sprite[eid]!.y = Position.y[eid]!;
	});

	query(world, [Rotation, GameSprite]).forEach((eid) => {
		GameSprite.sprite[eid]!.rotation = Rotation.angle[eid]!;
	});

	query(world, [Rotation]).forEach((eid) => {
		Rotation.angle[eid]! += 0.1 * world.delta;
	});
};

export function step(delta: number) {
	world.delta = delta;
	moveEntity(world);
}
