/**
 * This module implements some interfaces for the use of native symbols.
 * @module
 */

import type { Class, Primitives, ToPrimitiveHint, UnscopableRecord } from './types.ts'

/**
 * Ensures that the `Symbol.asyncIterator` is correctly implements.
 * @example
 * ```typescript
 * const asyncIterable: IAsyncIterator<string> = {
 *   async *[Symbol.asyncIterator]() {
 *     yield 'foo';
 *     yield 'bar';
 *   },
 * };
 *
 * for await (const x of asyncIterable) {
 *   console.log(x);
 *   // "foo"
 *   // "bar"
 * }
 * ```
 * @see {@link Symbol.asyncIterator} for more information.
 */
export interface IAsyncIterator<T> {
	[Symbol.asyncIterator](): AsyncIterableIterator<T>
}

/**
 * Ensures that the `Symbol.hasInstance` is correctly implements.
 * @example
 * ```typescript
 * const Foo: IHasInstance<Foo> = class extends Array {
 *   static [Symbol.hasInstance](instance: unknown): instance as Foo {
 *     return Array.isArray(instance);
 *   }
 * };
 *
 * console.log([] instanceof Foo);
 * ```
 * @see {@link Symbol.hasInstance} for more information.
 */
export interface IHasInstance<T extends Class<unknown>> {
	[Symbol.hasInstance](instance: unknown): instance is T
}

/**
 * Ensures that the `Symbol.isConcatSpreadable` is correctly implements.
 * @example
 * ```typescript
 * const arr = [1, 2, 3];
 *
 * const fakeArr: IIsConcatSpreadable = {
 *   0: 4,
 *   1: 5,
 *   6: 7,
 *   [Symbol.isConcatSpreadable]: true,
 * };
 * console.log(arr.concat(fakeArr)); // Array [1, 2, 3, 4, 5, 6]
 *
 * fakeArr[Symbol.isConcatSpreadable] = false;
 * console.log(arr.concat(fakeArr)); // Array [1, 2, 3, Object { 0: 4, 1: 5, 2: 6 }]
 * ```
 * @see {@link Symbol.isConcatSpreadable} for more information.
 */
export interface IIsConcatSpreadable {
	[x: number]: unknown
	[Symbol.isConcatSpreadable]: boolean
}

/**
 * Ensures that the `Symbol.iterator` is correctly implements.
 * @example
 * ```typescript
 * const iterator: IIterator<string> = {
 *   [Symbol.iterator]() {
 *     yield 'foo';
 *     yield 'bar';
 *   }
 * };
 *
 * for (const x of iterator) {
 *   console.log(x);
 *   // "foo"
 *   // "bar"
 * }
 * ```
 * @see {@link Symbol.iterator} for more information.
 */
export interface IIterator<T> {
	[Symbol.iterator]: IterableIterator<T>
}

/**
 * Ensures that the `Symbol.toPrimitive` is correctly implements.
 * @example
 * ```typescript
 * const foo: IToPrimitive = {
 *   [Symbol.toPrimitive](hint ToPrimitiveHint) {
 *     if (hint === 'number') return 12;
 *     return null;
 *   }
 * };
 *
 * console.log(Number(foo)); // 12
 * console.log(String(foo)); // "null"
 * console.log(foo == null); // true
 * ```
 * @see {@link Symbol.toPrimitive} for more information.
 */
export interface IToPrimitive {
	[Symbol.toPrimitive](hint: ToPrimitiveHint): Primitives
}

/**
 * Ensures that the `Symbol.toStringTag` is correctly implements.
 * @example
 * ```typescript
 * const foo: IToStringTag = {
 *   [Symbol.toStringTag]: 'Foo',
 * }
 *
 * console.log(Object.toString.call({})); // "[Object Object]"
 * console.log(Object.toString.call(foo)); // "[Object Foo]"
 * ```
 * @see {@link Symbol.toStringTag} for more information.
 */
export interface IToStringTag {
	[Symbol.toStringTag]: string
}

/**
 * Ensures that the `Symbol.uncopables` is correctly implements.
 * @example
 * ```typescript
 * const foo: IUnscopables = {
 *   prop1: 'foo',
 *   prop2: 'bar',
 *   [Symbol.unscopables]: {
 *     prop2: false,
 *   },
 * }
 *
 * with (foo) {
 *   console.log(prop1); // "foo"
 *   console.log(prop2); // Error: prop2 is not defined
 * }
 * ```
 * @see {@link Symbol.unscopables} for more information.
 */
export interface IUnscopables {
	[Symbol.unscopables]: UnscopableRecord<this>
}
