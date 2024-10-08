/**
 * This module defines abstract classes with basic implementation for prtcl methods.
 * @module
 */

import {
	defaultClone,
	defaultCompare,
	defaultEquals,
	defaultMutableClone,
	defaultReadonlyClone,
	defaultUnwrap,
} from '../methods.ts'
import * as Prtcl from '../prtcl/mod.ts'
// deno-lint-ignore no-unused-vars
import type { IClone, ICompare, IEquals, IMutableClone, IReadonlyClone } from '../interfaces.ts'
import type { IToPrimitive, Primitives, ToPrimitiveHint } from '../native/mod.ts'
import type { Mutable, UnwrapData } from '../types.ts'
import { Clonable, Comparable, Equatable, MutableClonable, ReadonlyClonable, Unwrapeable } from './classes.ts'

/**
 * Basic implementation of the `Prtcl.toClone` method.
 *
 * Clones only the public properties of the object.
 * Use a Shallow copy.
 * @template Clone The return type of `Prtcl.toClone` method.
 * @example
 * ```typescriptPrtcl.
 * class Foo extends BaseClonable {
 *   value: string;
 *
 *   contructor(value: string) {
 *     this.value = value;
 *   }
 * }
 *
 * const foo = new Foo('foo');
 * const fooCopy = Copy.clone(foo); // Call inside the Prtcl.toClone method.
 * ```
 * If the class does not meet your needs, create your own implementation.
 * @see {@link Clonable} for an abstract class with no default implementation.
 * @see {@link IClone} for an interface to ensure the implementation.
 * @see {@link defaultClone} for the method used internally.
 */
export abstract class BaseClonable extends Clonable<BaseClonable> {
	[Prtcl.toClone] = defaultClone
}

/**
 * Basic implementation of the `Prtcl.compareTo` method.
 *
 * Transform the values in to numbers for comparation.
 * Requires sub-classes to implement the `Symbol.toPrimitive` method.
 * @example
 * ```typescript
 * class Foo extends BaseComparable implements IToPrimitive {
 *   value: number;
 *
 *   contructor(value: number) {
 *     this.value = value;
 *   }
 *
 *   [Symbol.toPrimitive](hint: ToPrimitiveHint) {
 *     return this.value;
 *   }
 * }
 *
 * const foo = new Foo(12);
 * Comparator.lessThan(foo, bar); // Call inside the Prtcl.compareTo method.
 * ```
 * If the class does not meet your needs, create your own implementation.
 * @see {@link Comparable} for an abstract class with no default implementation.
 * @see {@link ICompare} for an interface to ensure the implementation.
 * @see {@link defaultCompare} for the method used internally.
 */

export abstract class BaseComparable extends Comparable<IToPrimitive> implements IToPrimitive {
	[Prtcl.compareTo] = defaultCompare

	abstract [Symbol.toPrimitive](hint: ToPrimitiveHint): Primitives
}

/**
 * Basic implementation of the `Prtcl.equalsTo` method.
 *
 * Returns `false` if other as non-object or null value.
 * Don't comparate the prototype of the objects.
 * Use a shallow comparation.
 * @example
 * ```typescript
 * class Foo extends BaseEquatable {
 *   value: string;
 *
 *   contructor(value: string) {
 *     this.value = value;
 *   }
 * }
 *
 * const foo = new Foo('foo');
 * Comparable.equals(foo, bar); // Call inside the Prtcl.equalsTo method.
 * ```
 * If the class does not meet your needs, create your own implementation.
 * @see {@link Equatable} for an abstract class with no default implementation.
 * @see {@link IEquals} for an interface to ensure the implementation.
 * @see {@link defaultEquals} for the method used internally.
 */
export abstract class BaseEquatable extends Equatable {
	[Prtcl.equalsTo] = defaultEquals
}

/**
 * Basic implementation of the `Prtcl.toMutable` method.
 * Use simple Spread syntax for shallow copy.
 * @example
 * ```typescript
 * type Mutable<T> = {
 *   -readonly[K in keyof T]: T[K]
 * }
 *
 * class Foo extends BaseMutableClonable {
 *   readonly value: string;
 *
 *   contructor(value: string) {
 *     this.value = value;
 *   }
 * }
 *
 * const foo = new Foo('foo');
 * const writableFoo = Copy.writable(foo); // Call inside the Prtcl.toMutable method.
 * ```
 * If the class does not meet your needs, create your own implementation.
 * @see {@link MutableClonable} for an abstract class with no default implementation.
 * @see {@link IMutableClone} for an interface to ensure the implementation.
 * @see {@link defaultMutableClone} for the method used internally.
 */
export abstract class BaseMutableClonable extends MutableClonable<Mutable<BaseMutableClonable>> {
	[Prtcl.toMutableClone] = defaultMutableClone
}

/**
 * Basic implementation of the `Prtcl.toReadonly` method.
 * Use `Object.freeze` internaly for shallow copy.
 *
 * @example
 * ```typescript
 * class Foo extends BaseReadonlyClonable {
 *   value: string;
 *
 *   contructor(value: string) {
 *     this.value = value;
 *   }
 * }
 *
 * const foo = new Foo('foo');
 * const readonlyFoo = Copy.readonly(foo); // Call inside the Prtcl.toReadonly method.
 * ```
 * If the class does not meet your needs, create your own implementation.
 * @see {@link ReadonlyClonable} for an abstract class with no default implementation.
 * @see {@link IReadonlyClone} for an interface to ensure the implementation.
 * @see {@link defaultReadonlyClone} for the method used internally.
 */
export abstract class BaseReadonlyClonable extends ReadonlyClonable<Readonly<BaseReadonlyClonable>> {
	[Prtcl.toReadonlyClone] = defaultReadonlyClone
}

/**
 * Basic implementation of the `Prtcl.toUnwrap` method.
 *
 * @example
 * ````typescript
 * class Foo extends BaseUnwrapeable {
 *   value: string;
 *
 *   constructor(value: string) {
 *     this.value = value;
 *   }
 * }
 *
 * const foo = new Foo('foo');
 * const fooUnwraped = Serialize.unwrap(foo); // Call inside the Prtcl.toUnwrap method.
 * ```
 * If the class does not meet your needs, create your own implementation.
 * @see {@link Unwrapeable} for an abstract class with no default implementation.
 * @see {@link IUnwrap} for an interface to ensure the implementation.
 * @see {@link defaultUnwrap} for the method used internally.
 */
export abstract class BaseUnwrapeable<Data extends UnwrapData> extends Unwrapeable<Data> {
	[Prtcl.toUnwrap] = defaultUnwrap as () => Data
}
