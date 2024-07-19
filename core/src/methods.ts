import type { FlatData, Mutable } from './types.ts'

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
export function defaultClone<T extends object>(this: T): T {
	return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
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
	return Number(this) - Number(other)
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

	const thisKeys = Object.keys(this)
	if (thisKeys.length !== Object.keys(other).length) return false
	const stack: Array<readonly [unknown, unknown]> = thisKeys.map((
		key,
	) => [Reflect.get(this, key), Reflect.get(other, key)])

	while (stack.length > 0) {
		const [val1, val2] = stack.shift()!

		if (Number.isNaN(val1) && Number.isNaN(val2)) continue

		if (typeof val1 === 'object' && val1 != null) {
			if (typeof val2 !== 'object' || val2 == null) return false

			const val1Keys = Object.keys(val1)

			if (val1Keys.length !== Object.keys(val2).length) return false

			stack.push(...val1Keys.map<[unknown, unknown]>((key) => [Reflect.get(val1, key), Reflect.get(val2, key)]))
		}
		if (val1 !== val2) return false
	}
	return true
}

/**
 * Default implementation of the `Prtcl.toFlat` method.
 *
 * This method calls `JSON.parse(JSON.stringify(this))`.
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
	return JSON.parse(JSON.stringify(this))
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
export function defaultMutableClone<T extends object>(this: T): Mutable<T> {
	if (Array.isArray(this)) return [...this] as T
	return { ...this }
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
export function defaultReadonlyClone<T extends object>(this: T): Readonly<T> {
	if (Array.isArray(this)) return Object.freeze([...this] as T)
	return Object.freeze({ ...this })
}
