import { createWorld } from "bitecs";
import {
	Acceleration,
	Position,
	Rotation,
	Velocity,
} from "@scripts/boids/components/places";
import { GameSprite } from "@scripts/boids/components/renders";
import { Flocking } from "@scripts/boids/components/flocks";
import movementSystem from "@scripts/boids/systems/movement";
import renderingSystem from "@scripts/boids/systems/rendering";
import steeringSystem from "@scripts/boids/systems/steering";

export const world = createWorld({
	components: {
		Position,
		Velocity,
		Acceleration,
		Rotation,
		GameSprite,
		Flocking,
	},
	delta: 0,
	bounds: {
		x: 0,
		y: 0,
		width: 800,
		height: 600,
	},
});

export function step(delta: number) {
	world.delta = delta;
	steeringSystem(world);
	movementSystem(world);
	renderingSystem(world);
}
