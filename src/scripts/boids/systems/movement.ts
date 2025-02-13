import {
	Acceleration,
	Position,
	Velocity,
} from "@scripts/boids/components/places";
import { query, type World } from "bitecs";

export interface MoveWorld extends World {
	components: {
		Position: typeof Position;
		Velocity: typeof Velocity;
		Acceleration: typeof Acceleration;
	};
	bounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	delta: number;
}

//todo: optimization: these can probably be collapsed into a single loop
export default function movementSystem(world: MoveWorld) {
	query(world, [Position]).forEach((eid) => {
		// Wrap
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
	});

	query(world, [Acceleration, Velocity]).forEach((eid) => {
		Velocity.x[eid]! += Acceleration.x[eid]!;
		Velocity.y[eid]! += Acceleration.y[eid]!;
	});

	query(world, [Velocity, Position]).forEach((eid) => {
		Position.x[eid]! += Velocity.x[eid]! * world.delta;
		Position.y[eid]! += Velocity.y[eid]! * world.delta;
	});
}
