/**
 * This module defines test utilities.
 * @module
 */

/**
 * Gets random integer between the minimun and maximun specified.
 * @param min The minimun.
 * @param max The maximun.
 * @return Random integer.
 */
export function getRandomInt(min: number, max: number) {
	// TODO: ensure that minimum and maximum are integers.
	return Math.floor(Math.random() * max) + min
}

/** The primitives array. */
const primitives = [null, undefined, 123, 'foo', 456n, Symbol('bar'), true]

/**
 * Gets random primivite value.
 * @return Random primivite.
 */
export function getRandomPrimitive() {
	return primitives[getRandomInt(0, primitives.length)]
}
