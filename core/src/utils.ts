import type { FlatArray, FlatRecord } from './types.ts'

interface FlatStackItem {
	parent: object
	key: string | number
	value: unknown
}

/**
 * Gets any value and returns it as an object.
 * @param value The any value non-nullable.
 * @returns The value if it's object or function, if it's a primitive transform into an object.
 */
export function toObject(value: NonNullable<unknown>): object {
	const type = typeof value

	if (type === 'function' || type === 'object') return value
	return Object.assign(value)
}

export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
	return typeof value === 'object'
}
const primitiveWrappers = [Boolean, BigInt, Number, String, Symbol] as const
// deno-lint-ignore ban-types
export function isPrimitiveWraper(value: object): value is Boolean | BigInt | Number | String | Symbol {
	return primitiveWrappers.some((Wraper) => value instanceof Wraper)
}

function isIterable(value: object): value is object & Iterable<unknown> {
	return Symbol.iterator in value
}

export function createFlatOutPut(value: object): FlatArray | FlatRecord {
	if (isIterable(value)) return []
	return {}
}

function getPrototypesKeys(obj: object): string[] {
	const stack: string[] = []
	let proto = Object.getPrototypeOf(obj)
	while (proto != null) {
		stack.push(...Object.getOwnPropertyNames(proto))
		proto = Object.getPrototypeOf(proto)
	}
	return stack
}

export function getItemsStack(parent: object): FlatStackItem[] {
	if (isIterable(parent)) {
		return Array.from(parent).map<FlatStackItem>((value, index) => ({ value, parent, key: index }))
	}
	const stack = Object.getOwnPropertyNames(parent).concat(getPrototypesKeys(parent))

	return stack.map<FlatStackItem>((key) => ({ value: Reflect.get(parent, key), parent, key }))
}
