/**
 * This module includes interfaces that define how implement the methods.
 * @module
 */

import type * as Prtcl from './prtcl/mod.ts'
import type { CloneHint, UnwrapData } from './types.ts'
import type {
	// deno-lint-ignore no-unused-vars
	BaseClonable,
	// deno-lint-ignore no-unused-vars
	BaseComparable,
	// deno-lint-ignore no-unused-vars
	BaseEquatable,
	// deno-lint-ignore no-unused-vars
	BaseMutableClonable,
	// deno-lint-ignore no-unused-vars
	BaseReadonlyClonable,
} from './classes/mod.ts'

/**
 * Ensures that the `Prtcl.toClone` method is correctly implements.toClone
 * @template Clone The return type of `Prtcl.toClone` method.
 * @example
 * ```typescript
 * class Foo implements IClone<Foo> {
 *   [Prtc.toClone](hint: CloneHint) {
 *     return new Foo()hint: ;
 *   }
 * }
 *
 * const foo = new Foo();
 * const bar = Copy.clone(foo); // Call inside the Prtcl.toClone method.
 * ```
 * @see {@link toClone} for see more information about the method.
 * @see {@link BaseClonable} for basic implementation.
 */
export interface IClone<Clone> {
	[Prtcl.toClone](hint: CloneHint): Clone
}

/**
 * Ensures that the `Prtcl.compareTo` method is correctly implements.
 * @template Other The other argument type of the `Prtcl.compareTo` method.
 * @example
 * ```typescript
 * class Foo implements ICompare<Foo> {
 *   #value = Math.random();
 *
 *   [Prtcl.compareTo](other: Foo) {
 *     return this.#value - other.#value;
 *   }
 * }
 *
 * const foo = new Foo();
 * Comparator.lessThan(foo, bar); // Call inside the Prtcl.compareTo method.
 * ```
 * @see {@link compareTo} for see more information about the method.
 * @see {@link BaseComparable} for basic implementation.
 */
export interface ICompare<Other> {
	[Prtcl.compareTo](other: Other): number
}

/**
 * Ensures that the `Prtcl.equalsTo` method is correctly implements.
 * @example
 * ```typescript
 * class Foo implements IEquals {
 *   #value = Math.random();
 *
 *   [Prtcl.equalsTo](other: unknown) {
 *     return other instanceof Foo && this.#value === other.#value;
 *   }
 * }
 *
 * const foo = new Foo();
 * Comparator.equals(foo, bar); // Call inside the Prtcl.equalsTo method.
 * ```
 * @see {@link Prtcl.equalsTo} for see more information about the method.
 * @see {@link BaseEquatable} for basic implementation.
 */
export interface IEquals {
	[Prtcl.equalsTo](other: unknown): boolean
}

/**
 * Ensures that the `Prtcl.toMutable` method is correctly implements.
 * @template MutableFoo The return type of `Prtcl.toMutable` method.
 * @example
 * ```typescript
 * class ReadonlyFoo implements IMutableClone<Foo> {
 *   readonly value: number;
 *
 *   constructor(value: number) {
 *   this.value = value;
 *   }
 *
 *   [Ptrcl.toMutableClone](hint: CloneHint) {
 *     return new MutableFoo(this.value);
 *   }
 * }
 *
 * class MutableFoo {
 *   value: number;
 *
 *   constructor(value: number) {
 *   this.value = value;
 *   }
 * }
 *
 * const readonlyFoo = new ReadonlyFoo();
 * const mutableFoo = Copy.mutable(foo); // Call inside the Prtcl.toMutable method.
 * ```
 * @see {@link Prtcl.toMutable} for see more information about the method.
 * @see {@link BaseMutableClonable} for basic implementation.
 */
export interface IMutableClone<MutableClone> {
	[Prtcl.toMutableClone](hint: CloneHint): MutableClone
}

/**
 * Ensures that the `Prtcl.toReadonly` method is correctly implements.
 * @template ReadonlyClone The return type of `Prtcl.toReadonly` method.
 * @example
 * ```typescript
 * class MutableFoo implements IReadonlyClone<ReadonlyFoo> {
 *   value: number;
 *
 *   constructor(value: number) {
 *     this.value = value;
 *   }
 *
 *   [Prtcl.toReadonlyClone](hint: CloneHint) {
 *     return new ReadonlyFoo(this.value);
 *   }
 * }
 *
 * class ReadonlyFoo {
 *   readonly value: number;
 *
 *   constructor(value: number) {
 *   this.value = value;
 *   }
 * }
 *
 * const mutableFoo = new MutableFoo();
 * const readonlyFoo = Copy.readonly(mutableFoo); // Call inside the Prtcl.toReadonly method.
 * ```
 * @see {@link Prtcl.toReadonly} for see more information about the method.
 * @see {@link BaseReadonlyClonable} for basic implementation.
 */
export interface IReadonlyClone<ReadonlyClone> {
	[Prtcl.toReadonlyClone](hint: CloneHint): ReadonlyClone
}

/**
 * Ensures that the `Prtcl.toUnwrap` method is correctly implements.
 * @template Data The return type of `Prtcl.toUnwrap` method.
 * @example
 * ```typescript
 * class Foo implements IUnwrap<number> {
 *   #value = Math.random();
 *
 *   [Prtcl.toUnwrap]() {
 *     return this.#value;
 *   }
 * }
 *
 * const foo = new Foo();
 * const fooUnwraped = Serializer.unwrap(foo); // Call inside the Prtcl.toUnwrap method.
 * ```
 * @see {@link Prtcl.toUnwrap} for see more information about the method.
 */
export interface IUnwrap<Data extends UnwrapData> {
	[Prtcl.toUnwrap](): Data
}

// TODO: export interface ISerialize {
//   [toSerialize](): string;
// }
//
// TODO: export interface IDeserialize<T> {
//   [fromSerialize](json: string): T;
// }
