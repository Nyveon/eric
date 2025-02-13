function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export default class Vector2D {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Add another vector to this vector.
	 * @param other vector to add
	 */
	add(other: Vector2D) {
		this.x += other.x;
		this.y += other.y;
	}

	/**
	 * Subtract another vector from this vector.
	 * @param other vector to subtract
	 */
	subtract(other: Vector2D) {
		this.x -= other.x;
		this.y -= other.y;
	}

	/**
	 * Scale this vector's magnitude by a scalar value.
	 * @param vector
	 * @param scalar
	 */
	scale(scalar: number) {
		this.x *= scalar;
		this.y *= scalar;
	}

	addScaled(vector: Vector2D, scalar: number) {
		this.x += vector.x * scalar;
		this.y += vector.y * scalar;
	}

	limit(max: number) {
		const magnitude = this.magnitude();
		if (magnitude > max) {
			this.scale(max / magnitude);
		}
	}

	/**
	 * Get the magnitude of this vector.
	 */
	magnitude(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	/**
	 * Set the magnitude of this vector.
	 * @param magnitude
	 */
	setMagnitude(magnitude: number) {
		const currentMagnitude = this.magnitude();
		if (currentMagnitude !== 0) {
			this.scale(magnitude / currentMagnitude);
		}
	}

	/**
	 * Get the distance between this vector and another vector.
	 * @param other
	 */
	distanceTo(other: Vector2D): number {
		return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
	}

	dot(other: Vector2D): number {
		return this.x * other.x + this.y * other.y;
	}

	zero() {
		this.x = 0;
		this.y = 0;
	}

	normalize() {
		const magnitude = this.magnitude();
		if (magnitude !== 0) {
			this.x /= magnitude;
			this.y /= magnitude;
		}
	}

	copy(other: Vector2D) {
		this.x = other.x;
		this.y = other.y;
	}

	static Zero(): Vector2D {
		return new Vector2D(0, 0);
	}

	static Random(min: number, max: number): Vector2D {
		return new Vector2D(
			getRandomArbitrary(min, max),
			getRandomArbitrary(min, max)
		);
	}

	static Subtract(a: Vector2D, b: Vector2D): Vector2D {
		return new Vector2D(a.x - b.x, a.y - b.y);
	}
}
