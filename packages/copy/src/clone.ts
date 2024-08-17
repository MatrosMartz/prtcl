import { Prtcl } from '@prtcl/prtcl'
import type { CloneHint } from '@prtcl/prtcl/types'

import { createObjectClone, getItems, setItem } from './utils/create-stack-items.ts'
import { isSuportedByStructuredClone } from './utils/structure-clone.ts'
import { clonePrimitivesWrappers, isPrimitiveWrapper } from './utils/primitive-wrappers.ts'
import { cloneNativeError, isNativeError } from './utils/native-errors.ts'

import { isObject } from './utils/commons.ts'
import type { CloneStackObject, CloningResult } from './types/mod.ts'

function internalClone<T extends object>(value: T, hint: CloneHint): CloningResult<T> {
	if (Prtcl.impl('clone', value)) return { cloned: true, value: value[Prtcl.toClone](hint) }
	if (isSuportedByStructuredClone(value)) return { cloned: true, value: structuredClone(value) }
	if (isPrimitiveWrapper(value)) return { cloned: true, value: clonePrimitivesWrappers(value) }
	if (isNativeError(value)) return { cloned: true, value: cloneNativeError(value) }
	if (value instanceof Error) return { cloned: true, value: new Error(value.message, { cause: value.cause }) as T }
	if (value instanceof Date) return { cloned: true, value: new Date(value) as T }
	if (value instanceof RegExp) return { cloned: true, value: new RegExp(value) as T }
	return { cloned: false }
}

function clone<T>(value: T): T {
	if (!isObject(value)) return value
	const result = internalClone(value, 'default')

	if (result.cloned) return result.value

	if (Array.isArray(value)) {
		const output = [...value] as T
		if (Object.isFrozen(value)) Object.freeze(output)
		return output
	}
	if (value instanceof Map) return new Map(value) as T
	if (value instanceof Set) return new Set(value) as T
	const output = { ...value }
	if (Object.isFrozen(value)) Object.freeze(output)
	return output
}

clone.deep = <T>(value: T): T => {
	if (!isObject(value)) return value
	const result = internalClone(value, 'deep')

	if (result.cloned) return result.value

	const output = createObjectClone(value)
	const stack = getItems(value)
	const visited = new WeakMap<object, object>([[value, output]])
	while (stack.length > 0) {
		const { value, key, type, parent } = stack.pop()!
		const parentOutput = visited.get(parent)

		if (parentOutput == null) throw new Error('ParentOut not defined')

		let output: unknown
		if (!isObject(value)) output = value
		else if (!visited.has(value)) {
			const result = internalClone(value, 'deep')
			if (result.cloned) output = result.value
			else {
				output = createObjectClone(value)
				stack.push(...getItems(value))
			}
			visited.set(value, output as object)
		} else output = visited.get(value)

		setItem(parentOutput as CloneStackObject, key, output)
		if (type === 'head' && Object.isFrozen(parent)) Object.freeze(parentOutput)
	}

	return output as T
}

clone.shallow = <T>(value: T): T => {
	if (!isObject(value)) return value
	const result = internalClone(value, 'shallow')

	if (result.cloned) return result.value

	if (Array.isArray(value)) {
		const output = [...value] as T
		if (Object.isFrozen(value)) Object.freeze(output)
		return output
	}
	if (value instanceof Map) return new Map(value) as T
	if (value instanceof Set) return new Set(value) as T
	const output = { ...value }
	if (Object.isFrozen(value)) Object.freeze(output)
	return output
}

export { clone }
