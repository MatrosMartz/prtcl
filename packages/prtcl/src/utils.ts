/**
 * This module defines internal utilities for prtcl.
 * @module
 */

import type { FlatArray, FlatRecord } from './types.ts'

/** item for stack in defaultFlat function. */
interface StackItem {
	parent: object
	key: string | number
	value: unknown
	state: 'head' | 'tail' | 'body'
}

/**
 * Gets any value and returns it as an object.
 * @param value The any value non-nullable.
 * @return The value if it's object or function, if it's a primitive transform into an object.
 */
export function toObject(value: NonNullable<unknown>): object {
	const type = typeof value

	if (type === 'function' || type === 'object') return value
	return Object(value)
}

/**
 * Checks if some value are any Object.
 * @param value The unknown value
 * @return True it is object, false otherwise.
 */
export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
	return typeof value === 'object'
}
const primitiveWrappers = [Boolean, BigInt, Number, String, Symbol] as const

/**
 * Checks if some object is primitive wraper.
 * @param value The object.
 * @return True if is Boolean, BigInt, Number, String or Symbol instance, false otherwise.
 */
// deno-lint-ignore ban-types
export function isPrimitiveWraper(value: object): value is Boolean | BigInt | Number | String | Symbol {
	return primitiveWrappers.some((Wraper) => value instanceof Wraper)
}

/**
 * Checks if some object is Iterable.
 * @param value The object.
 * @return True if contains `Symbol.iterator` method, false otherwise.
 */
function isIterable(value: object): value is object & Iterable<unknown> {
	return Symbol.iterator in value
}

/**
 * Create flat output for some object.
 * @param value The object.
 * @return Empty array if object is iterable, empty object otherwise.
 */
export function createFlatOutPut(value: object): FlatArray | FlatRecord {
	if (isIterable(value)) return []
	return {}
}

/**
 * Gets all prototype keys from object.
 * @param obj The object.
 * @return The all keys of object prototype.
 */
function getPrototypesKeys(obj: object): string[] {
	const stack: string[] = []
	let proto = Object.getPrototypeOf(obj)
	while (proto != null && proto !== Object.prototype) {
		stack.push(...Object.getOwnPropertyNames(proto))
		proto = Object.getPrototypeOf(proto)
	}
	return stack
}

function getItemState(arr: readonly unknown[], index: number): StackItem['state'] {
	if (index === 0) return 'head'
	if (index === arr.length - 1) return 'tail'
	return 'body'
}

/**
 * Gets items for flat stack, by parent object.
 * @param parent The parent object.
 * @return The all items.
 */
export function getFlatItemsStack(parent: object): StackItem[] {
	if (isIterable(parent)) {
		return Array.from(parent).map<StackItem>((value, index, arr) => ({
			value,
			parent,
			key: index,
			state: getItemState(arr, index),
		}))
	}
	const stack = Object.getOwnPropertyNames(parent).concat(getPrototypesKeys(parent))

	return stack.map<StackItem>((key, index, arr) => ({
		value: Reflect.get(parent, key),
		parent,
		key,
		state: getItemState(arr, index),
	}))
}

export function createCopyOutPut(value: object): Array<unknown> | Record<string | number, unknown> {
	if (Array.isArray(value)) return []
	return {}
}

export function getCopyItemsStack(parent: object): StackItem[] {
	if (Array.isArray(parent)) {
		return parent.map<StackItem>((value, index, arr) => ({
			value,
			parent,
			key: index,
			state: getItemState(arr, index),
		}))
	}
	const stack = Object.getOwnPropertyNames(parent).concat(getPrototypesKeys(parent))

	return stack.map<StackItem>((key, index, arr) => ({
		value: Reflect.get(parent, key),
		parent,
		key,
		state: getItemState(arr, index),
	}))
}
