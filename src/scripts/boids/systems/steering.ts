import {
	Acceleration,
	Position,
	Rotation,
	Velocity,
} from "@scripts/boids/components/places";
import { Boid } from "@scripts/boids/entities/boid";
import type { MoveWorld } from "@scripts/boids/systems/movement";
import Vector2D from "@scripts/vectors";
import { IsA, query } from "bitecs";

const NEIGHBOR_RADIUS = 24;
const ALIGNMENT_FORCE = 0.9;
const COHESION_FORCE = 1;
const SEPARATION_FORCE = 1.05;
const MAX_ACCELERATION = 0.05;
const MAX_SPEED = 10;
const DESIRED_SPEED = 5;
const RANDOM_WALK_SPEED = 0;

export default function steeringSystem(world: MoveWorld) {
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
		Rotation.angle[eid] = Math.atan2(Velocity.y[eid]!, Velocity.x[eid]!);

		vel.limit(MAX_SPEED);
		Velocity.x[eid] = vel.x;
		Velocity.y[eid] = vel.y;
	});
}
