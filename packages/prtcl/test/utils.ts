export function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * max) + min
}

const primitives = [null, undefined, 123, 'foo', 456n, Symbol('bar'), true]

export function getRandomPrimitive() {
	return primitives[getRandomInt(0, primitives.length)]
}
