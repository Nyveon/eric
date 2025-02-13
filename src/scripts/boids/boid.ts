import { world } from "@scripts/boids/game";
import { addComponent, addPrefab } from "bitecs";

const { Acceleration, Position, Rotation, Velocity, GameSprite, Flocking } =
	world.components;

export const Boid = addPrefab(world);
addComponent(world, Boid, Position);
Position.x[Boid] = 0;
Position.y[Boid] = 0;
addComponent(world, Boid, Rotation);
Rotation.angle[Boid] = 0;
addComponent(world, Boid, Velocity);
Velocity.x[Boid] = 0;
Velocity.y[Boid] = 0;
addComponent(world, Boid, GameSprite);
addComponent(world, Boid, Acceleration);
addComponent(world, Boid, Flocking);
