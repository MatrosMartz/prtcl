/**
 * This module provides a set of symbols within the `Prtcl` object, for the definition of methods such as `clone` and
 * `equals`.Its purpose is to be implemented in conjunction with another library that uses them inside.
 *
 * ```ts
 * import { Prtcl } from '@prtcl/prtcl';
 * import { clone } from '@prtcl/copy';
 *
 * const obj = {
 *   value: 1,
 *   [Prtcl.toClone]() {
 *     return { ...obj };
 *   },
 * };
 *
 * const objClone = clone(obj);
 * ```
 *
 * ## Methods :
 *
 * - {@linkcode Prtcl.toClone} Method that returns a copy of the object.
 * - {@linkcode Prtcl.compareTo} Method that compares the object with another object, and returns the difference in and
 *   numerical value.
 * - {@linkcode Prtcl.equalsTo} Method that checks whether one object is equal to another.
 * - {@linkcode Prtcl.toMutableClone} Method that returns a mutable copy of the object.
 * - {@linkcode Prtcl.toReadonlyClone} Method that returns a readonly copy of the object.
 * - {@linkcode Prtcl.toUnwrap} Method that unwraps an object into its primitive values or into a unwrap object.
 *
 * ## Guard function
 *
 * The `impl` function works as a guard on the implementation of the methods, ensuring that the object uses the method
 * symbol and its value is a function.
 *
 * As first parameter it receives the method to check if it exists in the object, and in the second one the object as such.
 * Returning true if the object complies with the interface of the method, false otherwise.
 *
 * Example with the clone method:
 *
 * ```ts
 * import { Prtcl } from '@prtcl/prtcl';
 *
 * if (Prtcl.impl('clone', obj)) {
 *   // `obj` uses the Prtcl.toClone key and its value is a function.
 * }
 * ```
 *
 * ## Type Assertion
 *
 * Contains types of each method for type assertion, which receive a type and return the intercept between the type and the
 * method interface.
 *
 * Example with the clone method:
 *
 * ```typescript
 * import type { Extend } from '@prtclprtcl';
 *
 * const obj = {};
 *
 * obj as Extend.Clone<typeof obj>; // (typeof obj) & { [Prtcl.toClone](): tyepof obj }
 * ```
 *
 * ## Default Methods
 *
 * Default methods to implement the various methods of Prtcl. Used in [Base Classes](#base-classes). Not recommended for
 * direct use.
 *
 * Example:
 * ```ts
 * import { useToClone } from 'prtcl/decorators';
 *
 * class Foo<T> {
 *   value: T;
 *
 *   constructor(value: T) {
 *     this.value = value;
 *   }
 *
 *   @useToClone
 *   customClone() {
 *     return new Foo(this.value);
 *   }
 * }
 * ```
 *
 * - {@linkcode defaultClone}
 * - {@linkcode defaultCompare}
 * - {@linkcode defaultEquals}
 * - {@linkcode defaultMutableClone}
 * - {@linkcode defaultReadonlyClone}
 * - {@linkcode defaultUnwrap}
 *
 * ## implementations
 *
 * You can simply use the symbols, to define the methods, however, this module offers several ways to implement them:
 * - {@link ./interfaces.ts interfaces} They define how to implement the methods, and lack a default implementation.
 * - {@link ./classes/classes.ts abstract classes} Define how to implement the various methods of Prtcl, and lack
 *   default implementation.
 * - {@link ./classes/base-classes.ts base classes} That use the default methods internally. Not recommend using it
 *   because of its limited implementation.
 * - {@link ./decorators/classes.ts class decorators} That use the functions passed as values for the implementation
 *   of the methods. The first parameter received by the function passed to it is the instance of the class.
 * - {@link ./decorators/methods.ts method decorators} That use the method as the value of the prtcl method.
 * @module
 */

export type * as Extends from './extend.ts'
export * as Prtcl from './prtcl/mod.ts'
