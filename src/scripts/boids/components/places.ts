import { MAX_ENTITIES } from "@scripts/boids/constants";

export const Position = {
	x: new Float32Array(MAX_ENTITIES),
	y: new Float32Array(MAX_ENTITIES),
};

export const Velocity = {
	x: new Float32Array(MAX_ENTITIES),
	y: new Float32Array(MAX_ENTITIES),
};

export const Acceleration = {
	x: new Float32Array(MAX_ENTITIES),
	y: new Float32Array(MAX_ENTITIES),
};

export const Rotation = {
	angle: new Float32Array(MAX_ENTITIES), //radians
};
