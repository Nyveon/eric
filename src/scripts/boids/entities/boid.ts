import { world } from "@scripts/boids/game";
import { addComponent, addPrefab } from "bitecs";

const { Acceleration, Position, Rotation, Velocity, GameSprite, Flocking } =
	world.components;

export const Boid = addPrefab(world);
addComponent(
	world,
	Boid,
	Position,
	Velocity,
	Acceleration,
	Rotation,
	GameSprite,
	Flocking
);
