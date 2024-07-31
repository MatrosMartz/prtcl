import type { Primitives } from './native/types.ts'
import type { CloneHint, FlatData, Mutable } from './types.ts'
import { createCopyOutPut, createFlatOutPut, getCopyItemsStack, getFlatItemsStack, isPrimitiveWraper } from './utils.ts'

/**
 * Default implementation of the `Prtcl.toClone` method.
 *
 * Only works with public fields.
 * @return Shallow copy of the object it belongs to.
 * @example
 * ```typescript
 * const foo1 = {
 *   value: 1,
 *   [Prtcl.toClone]: defaultClone,
 * };
 *
 * const foo2 = Copy.clone(foo1); // Call inside the Prtcl.toClone method.
 * console.log(foo2); // Object { value: 1 }
 * console.log(foo1 === foo2); // false
 * ```
 */
export function defaultClone<T extends object>(this: T, hint: CloneHint = 'default'): T {
	if (typeof this === 'function') return this
	if (this == null || typeof this !== 'object') throw new Error('defaultClone can not be called in a primitive')
	if (hint !== 'deep') {
		const result = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
		if (Object.isFrozen(this)) Object.freeze(result)
		return result
	}

	const result = Object.create(Object.getPrototypeOf(this)) as object
	const visited = new WeakMap([[this as object, result]])

	const stack = getCopyItemsStack(this)

	while (stack.length > 0) {
		const { key, parent, value, state } = stack.pop()!

		const copyParent = visited.get(parent)

		if (copyParent == null) throw new Error('copyParent not defined')

		let copyValue: unknown
		if (typeof value !== 'object' || value == null) copyValue = value
		else {
			if (!visited.has(value)) {
				visited.set(value, Object.create(Object.getPrototypeOf(value)))
				stack.push(...getCopyItemsStack(value))
			}
			copyValue = visited.get(value)
		}

		;(copyParent as Record<string | number, unknown>)[key] = copyValue

		if (state === 'head' && Object.isFrozen(parent)) Object.freeze(copyParent)
	}

	if (Object.isFrozen(this)) Object.freeze(result)
	return result as T
}
/**
 * Default implementation of the `Prtcl.compareTo` method.
 *
 * Only works with objects that can be converted into numbers.
 * @param other The object with compare.
 * @return The diference in number value.
 * @example
 * ```typescript
 * const foo = {
 *   value: 1,
 *   [Prtcl.compareTo]: defualtCompare,
 *   valueOf() {
 *     return this.value;
 *   },
 * };
 *
 * Comparator.lessThat(foo, bar); // Call inside the Prtcl.compareTo method.
 * ```
 */
export function defaultCompare(this: object, other: unknown): number {
	const [thisNum, otherNum] = [Number(this), Number(other)]
	if (Number.isNaN(thisNum)) throw new Error(`Can not convert ${this} in to number`)
	if (Number.isNaN(otherNum)) throw new Error(`Can not convert ${other} in to number`)
	return thisNum - otherNum
}

/**
 * Default implementation of the `Prtcl.equalsTo` method.
 *
 * Only works with public fields.
 * Shallow compare.
 * @return True, if two objects are equals, false otherwise.
 * @example
 * ```typescript
 * const foo = {
 *   [Prtcl.equalsTo]: defaultEquals,
 * };
 *
 * Comparator.equalsTo(foo, bar); // Call inside the Prtcl.equalsTo method.
 * ```
 */
export function defaultEquals(this: object, other: unknown): boolean {
	if (typeof other !== 'object' || other == null) return false

	if (Number.isNaN(this) && Number.isNaN(other)) return true

	return this === other
	// 	const thisKeys = Object.keys(this)
	// 	if (thisKeys.length !== Object.keys(other).length) return false
	// 	const stack: Array<readonly [unknown, unknown]> = thisKeys.map((
	// 		key,
	// 	) => [Reflect.get(this, key), Reflect.get(other, key)])
	//
	// 	while (stack.length > 0) {
	// 		const [val1, val2] = stack.shift()!
	//
	// 		if (Number.isNaN(val1) && Number.isNaN(val2)) continue
	//
	// 		if (typeof val1 === 'object' && val1 != null) {
	// 			if (typeof val2 !== 'object' || val2 == null) return false
	//
	// 			const val1Keys = Object.keys(val1)
	//
	// 			if (val1Keys.length !== Object.keys(val2).length) return false
	//
	// 			stack.push(...val1Keys.map<[unknown, unknown]>((key) => [Reflect.get(val1, key), Reflect.get(val2, key)]))
	// 		}
	// 		if (val1 !== val2) return false
	// 	}
	// 	return true
}

/**
 * Default implementation of the `Prtcl.toFlat` method.
 *
 * If the object has the method `Prtcl.toFlat`, calls it.
 * If the object has the method 'toJSON', calls it.
 * Does not call them if they refer to this function.
 * If the object is iterable, transforms it to an array, otherwise to an object.
 *
 * @return Fattened data.
 * @example
 * ```typescript
 * const foo = {
 *   field: 1,
 *   get getter() {
 *     return 'bar';
 *   },
 *   method() {},
 *   [Prtcl.toFlat]: defaultFlat,
 * };
 *
 * const fooFlated = Serialize.flat(foo); // Calls inside the Prtcl.toFlat method
 * console.log(fooFlated); // Object { field: 1, getter: 'bar'}
 * ```
 */
export function defaultFlat(this: object): FlatData {
	if (typeof this === 'function') return undefined
	if (isPrimitiveWraper(this)) return this.valueOf()
	if ('toJSON' in this && typeof this.toJSON === 'function' && defaultFlat !== this.toJSON) return this.toJSON()

	const result = createFlatOutPut(this)

	const visited = new WeakMap([[this, result]])

	const stack = getFlatItemsStack(this)

	while (stack.length > 0) {
		const { key, parent, value } = stack.pop()!

		if (typeof value === 'function') continue

		const flatParent = visited.get(parent)

		if (flatParent == null) throw new Error('FlatParent not defined')

		if (Reflect.has(flatParent, key)) continue

		let flatValue: FlatData

		if (typeof value === 'object' && value != null) {
			if (isPrimitiveWraper(value)) {
				flatValue = value.valueOf()
			} else if ('toJSON' in value && typeof value.toJSON === 'function' && defaultFlat != value.toJSON) {
				flatValue = value.toJSON()
			} else {
				if (!visited.has(value)) {
					visited.set(value, createFlatOutPut(value))
					stack.push(...getFlatItemsStack(value))
				}

				flatValue = visited.get(value)
			}
		} else {
			flatValue = value as Primitives
		}

		;(flatParent as Record<string | number, unknown>)[key] = flatValue
	}

	return result as FlatData
}

/**
 * Default implementation of the `Prtcl.toMutableClone` method.
 *
 * Only works with public fields.
 * @return Shallow mutable copy of the object it belongs to.
 * @example
 * ```typescript
 * const foo = Object.freeze({
 *   value: 1,
 *   [Prtcl.toMutableClone]: defaultMutableClone,
 * });
 *
 * const mutableFoo = Copy.mutableClone(foo1) // Calls inside the Prtcl.toMutableClone method
 * console.log(mutableFoo); // Object { value: 1 }
 * console.log(foo1 === mutableFoo); // false
 * mutableFoo.value = 2; // Works
 * foo.value = 2; // Don't change the value
 * ```
 */
export function defaultMutableClone<T extends object>(this: T, hint: CloneHint = 'default'): Mutable<T> {
	if (typeof this === 'function') return this
	if (hint !== 'deep') {
		if (Array.isArray(this)) return [...this] as T
		return { ...this }
	}

	const result = createCopyOutPut(this)
	const visited = new WeakMap([[this as object, result]])

	const stack = getCopyItemsStack(this)

	while (stack.length > 0) {
		const { key, parent, value } = stack.pop()!

		const copyParent = visited.get(parent)

		if (copyParent == null) throw new Error('copyParent not defined')

		let copyValue: unknown

		if (typeof value !== 'object' || value == null) copyValue = value
		else {
			if (!visited.has(value)) {
				visited.set(value, createCopyOutPut(value))
				stack.push(...getCopyItemsStack(value))
			}
			copyValue = visited.get(value)
		}

		;(copyParent as Record<string | number, unknown>)[key] = copyValue
	}

	return result as never
}

/**
 * Default implementation of the `Prtcl.toReadonlyClone` method.
 *
 * Only works with public fields.
 * @return Shallow readonly copy of the object it belongs to.
 * @example
 * ```typescript
 * const foo = {
 *   value: 1,
 *   [Prtcl.toReadonlyClone]: defaultReadonlyClone,
 * };
 *

 * const readonlyFoo = Copy.readonlyClone(foo1); // Calls inside the Prtcl.toReadonlyClone method
 * console.log(readonlyFoo); // Object { value: 1 }
 * console.log(foo1 === readonlyFoo); // false
 * foo.value = 2; // Works
 * readonlyFoo.value = 2; // Don't change the value
 * ```
 */
export function defaultReadonlyClone<T extends object>(this: T, hint: CloneHint = 'default'): Readonly<T> {
	if (typeof this === 'function') return this
	if (hint !== 'deep') {
		if (Array.isArray(this)) return Object.freeze([...this] as T)
		return Object.freeze({ ...this })
	}

	const result = createCopyOutPut(this)
	const visited = new WeakMap([[this as object, result]])

	const stack = getCopyItemsStack(this)

	while (stack.length > 0) {
		const { key, parent, value, state } = stack.pop()!

		const copyParent = visited.get(parent)

		if (copyParent == null) throw new Error('copyParent not defined')

		let copyValue: unknown

		if (typeof value !== 'object' || value == null) copyValue = value
		else {
			if (!visited.has(value)) {
				visited.set(value, createCopyOutPut(value))
				stack.push(...getCopyItemsStack(value))
			}
			copyValue = visited.get(value)
		}

		;(copyParent as Record<string | number, unknown>)[key] = copyValue

		if (state === 'head') Object.freeze(copyParent)
	}

	return Object.freeze(result) as Readonly<T>
}
