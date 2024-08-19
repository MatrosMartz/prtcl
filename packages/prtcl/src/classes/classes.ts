/**
 * This module defines abstracts classes with abstract prtcl methods.
 * @module
 */

import type { IClone, ICompare, IEquals, IMutableClone, IReadonlyClone, IUnwrap } from '../interfaces.ts'
import * as Prtcl from '../prtcl/mod.ts'
import type { CloneHint, UnwrapData } from '../types.ts'
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
	// deno-lint-ignore no-unused-vars
	BaseUnwrapeable,
} from './base-classes.ts'

/**
 * Ensures implementation of the `Prtcl.toClone` method.
 * @template Clone The return type of `Prtcl.toClone` method.
 * @example
 * ```typescript
 * class Foo extends Clonable<Foo> {
 *   #value: string;
 *
 *   constuctor(value: string) {
 *     this.#value = value;
 *   }
 *
 *   [Prtcl.toClone](hint: CloneHint) {
 *     return new Foo(this.#value);
 *   }
 * }
 *
 * const foo = new Foo();
 * const fooCopy = Copy.clone(foo); // Call inside the Prtcl.toClone method.
 * ```
 * This class is just one way to implement the method.
 * @see {@link BaseClonable} for basic implementacion.
 * @see {@link IClone} for an interface to ensure the implementation.
 */
export abstract class Clonable<Clone extends Clonable<Clone>> implements IClone<Clone> {
	abstract [Prtcl.toClone](hint: CloneHint): Clone
}

/**
 * Ensures implementation of the `Prtcl.compareTo` method.
 * @template Other The other argument type of the `Prtcl.compareTo` method.
 * @example
 * ```typescript
 * class Foo extends Comparable {
 *   #value: string;
 *
 *   constuctor(value: string) {
 *     this.#value = value;
 *   }
 *
 *   [Prtcl.compareTo](other: Foo) {
 *     return this.#value - other.#value;
 *   }
 * }
 *
 * const foo = new Foo();
 * Comparator.lessThan(foo, bar); // Call inside the Prtcl.compareTo method.
 * ```
 * This class is just one way to implement the method.
 * @see {@link BaseComparable} for basic implementacion.
 * @see {@link ICompare}
 */
export abstract class Comparable<Other> implements ICompare<Other> {
	abstract [Prtcl.compareTo](other: Other): number
}

/**
 * Ensures implementation of the `Prtcl.equalsTo` method.
 * @example
 * ```typescript
 * class Foo extends Equatable {
 *   #value: string;
 *
 *   constuctor(value: string) {
 *     this.#value = value;
 *   }
 *
 *   [Prtcl.equalsTo](other: unknown) {
 *     return other instanceof Foo && this.#value === other.#value
 *   }
 * }
 *
 * const foo = new Foo();
 * Comparator.equals(foo, bar); // Call inside the Prtcl.equalsTo method.
 * ```
 * This class is just one way to implement the method.
 * @see {@link BaseEquatable} for basic implementacion.
 * @see {@link IEquals} for an interface to ensure the implementation.
 */
export abstract class Equatable implements IEquals {
	abstract [Prtcl.equalsTo](other: unknown): boolean
}

/**
 * Ensures implementation of the `Prtcl.toMutable` method.
 * @template MutableFoo The return type of `Prtcl.toMutable` method.
 * @example
 * ```typescript
 * class ReadonlyFoo extends MutableClonable {
 *   readonly value: string;
 *
 *   constuctor(value: string) {
 *     this.value = value;
 *   }
 *
 *   [Prtcl.toMutableClone](hint: CloneHint) {
 *     return new Foo(this.#value);
 *   }
 * }
 *
 * const foo = new Foo();
 * const fooCopy = Copy.mutable(foo); // Call inside the Prtcl.toMutable method.
 * ```
 * This class is just one way to implement the method.
 * @see {@link BaseMutableClonable} for basic implementacion.
 * @see {@link IMutableClone} for an interface to ensure the implementation.
 */
export abstract class MutableClonable<MutableClone> implements IMutableClone<MutableClone> {
	abstract [Prtcl.toMutableClone](hint: CloneHint): MutableClone
}

/**
 * Ensures implementation of the `Prtcl.toReadonly` method.
 * @template ReadonlyClone The return type of `Prtcl.toReadonly` method.
 * @example
 * ```typescript
 * class Foo extends ReadonlyClonable {
 *   #value: string;
 *
 *   constuctor(value: string) {
 *     this.#value = value;
 *   }
 *
 *   [Prtcl.toReadonlyClone](hint: CloneHint) {
 *     return new Foo(this.#value);
 *   }
 * }
 *
 * const foo = new Foo();
 * const fooCopy = Copy.clone(foo); // Call inside the Prtcl.toReadonly method.
 * ```
 * This class is just one way to implement the method.
 * @see {@link BaseReadonlyClonable} for basic implementacion.
 * @see {@link IReadonlyClone} for an interface to ensure the implementation.
 */
export abstract class ReadonlyClonable<ReadonlyClone> implements IReadonlyClone<ReadonlyClone> {
	abstract [Prtcl.toReadonlyClone](hint: CloneHint): ReadonlyClone
}

/**
 * Ensures implementation of the `Prtcl.toUnwrap` method.
 * @template Data The return type of `Prtcl.toUnwrap` method.
 * @example
 * ```typescript
 * class Foo extends Unwrapeable<string> {
 *   #value: string;
 *
 *   contructor(value: string) {
 *     this.#value = value;
 *   }
 *
 *   [Prtcl.toUnwrap]() {
 *     return this.#value
 *   }
 * }
 *
 * const foo = new Foo('foo');
 * const fooUnwraped = Serializable.unwrap(foo); // Call inside the Prtcl.toUnwrap method.
 * ```
 * This class is just one way to implement the method.
 * @see {@link BaseUnwrapeable} for basic implementacion.
 * @see {@link IUnwrap} for an interface to ensure the implementation.
 */
export abstract class Unwrapeable<Data extends UnwrapData> implements IUnwrap<Data> {
	abstract [Prtcl.toUnwrap](): Data
}

// TODO: export abstract class Serializable {}
