import type { CloneStackItem, CloneStackObject } from '../types/commons.ts'

export function createObjectClone(parent: object): CloneStackObject {
	if (Array.isArray(parent)) return []
	if (parent instanceof Map) return new Map()
	if (parent instanceof Set) return new Set()
	return {}
}

function getItemType(index: number, length: number) {
	if (index >= length) throw new Error('index exceed the length')
	return index === 0 ? 'head' : index === length - 1 ? 'tail' : 'body'
}

function getAllKeys(obj: object): string[] {
	const keys = Object.getOwnPropertyNames(obj)
	let proto = Object.getPrototypeOf(obj)
	while (proto != null && proto !== Object.prototype) {
		keys.push(...Object.getOwnPropertyNames(proto))
		proto = Object.getPrototypeOf(proto)
	}

	return keys
}

type KeysToStackItem<T> = (value: T, index: number, arr: readonly unknown[]) => CloneStackItem

const keysToStackItem = {
	array(parent: object): KeysToStackItem<unknown> {
		return (value, key, { length }) => ({
			value,
			parent,
			key,
			type: getItemType(key, length),
		})
	},
	map(parent: object): KeysToStackItem<[unknown, unknown]> {
		return ([key, value], index, { length }) => ({
			value,
			key,
			parent,
			type: getItemType(index, length),
		})
	},
	set(parent: object): KeysToStackItem<unknown> {
		return (value, index, { length }) => ({
			value,
			key: value,
			parent,
			type: getItemType(index, length),
		})
	},
	obj(parent: object): KeysToStackItem<string> {
		return (key, index, { length }) => ({
			value: Reflect.get(parent, key),
			key,
			parent,
			type: getItemType(index, length),
		})
	},
}

export function getItems(parent: object): CloneStackItem[] {
	if (Array.isArray(parent)) return parent.map(keysToStackItem.array(parent))

	if (parent instanceof Map) return Array.from(parent).map(keysToStackItem.map(parent))

	if (parent instanceof Set) return Array.from(parent).map(keysToStackItem.set(parent))

	return getAllKeys(parent).map(keysToStackItem.obj(parent))
}

export function setItem(parent: CloneStackObject, key: unknown, value: unknown) {
	if (Array.isArray(parent)) parent[key as number] = value
	else if (parent instanceof Map) parent.set(key, value)
	else if (parent instanceof Set) parent.add(value)
	else parent[key as string] = value
}
