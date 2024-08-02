/**

* This module defines test utilities.
* @module
 */

/**

* Gets random integer between the minimun and maximun specified.
* @param min The minimun, if it is not an integer, round it.
* @param max The maximun, if it is not an integer, round it.
* @return Random integer.
 */
export function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * Math.floor(max)) + Math.floor(min)
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
