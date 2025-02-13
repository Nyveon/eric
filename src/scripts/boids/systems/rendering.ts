import { Position, Rotation } from "@scripts/boids/components/places";
import { GameSprite } from "@scripts/boids/components/renders";
import { query, type World } from "bitecs";

interface RenderWorld extends World {
	components: {
		Position: typeof Position;
		Rotation: typeof Rotation;
		GameSprite: typeof GameSprite;
	};
}

//todo: can probably also be flattened
export default function renderingSystem(world: RenderWorld) {
	query(world, [Position, GameSprite]).forEach((eid) => {
		GameSprite.sprite[eid]!.x = Position.x[eid]!;
		GameSprite.sprite[eid]!.y = Position.y[eid]!;
	});

	query(world, [Rotation, GameSprite]).forEach((eid) => {
		GameSprite.sprite[eid]!.rotation = Rotation.angle[eid]!;
	});
}
