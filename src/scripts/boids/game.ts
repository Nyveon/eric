import { Boid } from "@scripts/boids/boid";
import Vector2D from "@scripts/boids/vectors";
import { createWorld, IsA, query } from "bitecs";
import { type Sprite } from "pixi.js";

const MAX_ENTITIES = 10000;

export const world = createWorld({
	components: {
		Position: {
			x: new Float32Array(MAX_ENTITIES),
			y: new Float32Array(MAX_ENTITIES),
		},
		Velocity: {
			x: new Float32Array(MAX_ENTITIES),
			y: new Float32Array(MAX_ENTITIES),
		},
		Acceleration: {
			x: new Float32Array(MAX_ENTITIES),
			y: new Float32Array(MAX_ENTITIES),
		},
		Rotation: {
			angle: new Float32Array(MAX_ENTITIES),
		},
		GameSprite: {
			sprite: [] as Sprite[],
		},
		Flocking: {},
	},
	delta: 0,
	bounds: {
		x: 0,
		y: 0,
		width: 800,
		height: 600,
	},
});

type GameWorld = typeof world;

const { Position, Rotation, GameSprite, Velocity, Acceleration } =
	world.components;

//todo: optimization: these can probably be collapsed into a single loop
const movementSystem = (world: GameWorld) => {
	query(world, [Position, GameSprite]).forEach((eid) => {
		//wrap
		if (Position.x[eid]! > world.bounds.width) {
			Position.x[eid] = 0;
		}
		if (Position.x[eid]! < world.bounds.x) {
			Position.x[eid] = world.bounds.width;
		}
		if (Position.y[eid]! > world.bounds.height) {
			Position.y[eid] = 0;
		}
		if (Position.y[eid]! < world.bounds.y) {
			Position.y[eid] = world.bounds.height;
		}

		GameSprite.sprite[eid]!.x = Position.x[eid]!;
		GameSprite.sprite[eid]!.y = Position.y[eid]!;
	});

	query(world, [Rotation, GameSprite]).forEach((eid) => {
		GameSprite.sprite[eid]!.rotation = Rotation.angle[eid]!;
	});

	query(world, [Acceleration, Velocity]).forEach((eid) => {
		Velocity.x[eid]! += Acceleration.x[eid]!;
		Velocity.y[eid]! += Acceleration.y[eid]!;
	});

	query(world, [Velocity, Position]).forEach((eid) => {
		Position.x[eid]! += Velocity.x[eid]! * world.delta;
		Position.y[eid]! += Velocity.y[eid]! * world.delta;
	});
};

const NEIGHBOR_RADIUS = 24;
const ALIGNMENT_FORCE = 0.9;
const COHESION_FORCE = 1;
const SEPARATION_FORCE = 1.05;
const MAX_ACCELERATION = 0.05;
const MAX_SPEED = 10;
const DESIRED_SPEED = 5;
const RANDOM_WALK_SPEED = 0;

const steeringSystem = (world: GameWorld) => {
	const boids = query(world, [IsA(Boid)]);

	//todo: vector struct reusable
	boids.forEach((eid) => {
		const pos = new Vector2D(Position.x[eid]!, Position.y[eid]!);
		const vel = new Vector2D(Velocity.x[eid]!, Velocity.y[eid]!);
		const accel = Vector2D.Zero();
		const alignment = Vector2D.Zero();
		const cohesion = Vector2D.Zero();
		const separation = Vector2D.Zero();
		const randomWalk = Vector2D.Random(-RANDOM_WALK_SPEED, RANDOM_WALK_SPEED);

		let total = 0;

		for (const other of boids) {
			if (other === eid) continue;

			const otherPosition = new Vector2D(
				Position.x[other]!,
				Position.y[other]!
			);

			const dist = pos.distanceTo(otherPosition);

			if (dist > NEIGHBOR_RADIUS) continue;
			total++;

			alignment.x += Velocity.x[other]!;
			alignment.y += Velocity.y[other]!;

			cohesion.x += Position.x[other]!;
			cohesion.y += Position.y[other]!;

			const diff = new Vector2D(
				Position.x[eid]! - Position.x[other]!,
				Position.y[eid]! - Position.y[other]!
			);
			diff.scale(1 / dist);
			separation.add(diff);
		}

		if (total > 0) {
			alignment.setMagnitude(DESIRED_SPEED);
			alignment.subtract(vel);
			alignment.scale(ALIGNMENT_FORCE);

			cohesion.scale(1 / total);
			cohesion.subtract(pos);
			cohesion.setMagnitude(DESIRED_SPEED);
			cohesion.subtract(vel);
			cohesion.scale(COHESION_FORCE);

			separation.setMagnitude(DESIRED_SPEED);
			separation.subtract(vel);
			separation.scale(SEPARATION_FORCE);
		}

		accel.add(alignment);
		accel.add(cohesion);
		accel.add(separation);
		accel.add(randomWalk);
		accel.limit(MAX_ACCELERATION);

		Acceleration.x[eid] = accel.x;
		Acceleration.y[eid] = accel.y;
		Rotation.angle[eid] = Math.atan2(Velocity.y[eid]!, Velocity.x[eid]!) + 90;

		vel.limit(MAX_SPEED);
		Velocity.x[eid] = vel.x;
		Velocity.y[eid] = vel.y;
	});
};

export function step(delta: number) {
	world.delta = delta;
	steeringSystem(world);
	movementSystem(world);
}
