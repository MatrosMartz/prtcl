/**
 * This module defines the Prtcl symbols.
 * @module
 */

/**
 * A method that returns a copy of an object.
 * @example
 * ```typescript
 * const foo = {
 *   value: 'foo',
 *   [Prtcl.toClone](hint: CloneHint) {
 *     return { ...this };
 *   }
 * };
 *
 * const bar = Copy.clone(foo); // Call inside the Prtcl.cloneThis method.
 * ```
 */
export const toClone = Symbol.for('Prtcl.toClone')

/**
 * A method that returns the difference between an object and another as a number.
 * @example
 * ```typescript
 * const foo = {
 *   value: 1,
 *   [Prtcl.compareTo](other: unknown) {
 *      return this.value - Number(other?.value);
 *   }
 * };
 *
 * Comparator.lessThan(foo, bar); // Call inside the Prtcl.compareTo method.
 * ```
 */
export const compareTo = Symbol.for('Prtcl.compareTo')

/**
 * A method that returns true if an oject is equal to another, false otherwise.
 * @example
 * ```typescript
 * const foo = {
 *   value: 'foo',
 *   [Prtcl.compareTo](other: unknown) {
 *     return this.value === other?.value;
 *   }
 * };
 *
 * Comparator.equals(foo, bar); // Call inside the Prtcl.equalsTo method.
 * ```
 */
export const equalsTo = Symbol.for('Prtcl.equalsTo')

/**
 * A mathod that returns the a writable copy of the readonly object.
 * @example
 * ```typescript
 * const foo = Object.freeze({
 *   value: 'foo',
 *   [Prtcl.toMutableClone](hint: CloneHint) {
 *     return { ...this };
 *   }
 * });
 *
 * Copy.mutable(foo); // Call inside the Prtc.toMutable method.
 * ```
 */
export const toMutableClone = Symbol.for('Prtcl.toMutableClone')

/**
 * A method that returns the a readonly copy of the object.
 * @example
 * ```typescript
 * const foo = {
 *   value: 'foo',
 *   [Prtcl.toReadonlyClone](hint: CloneHint) {
 *     return Object.freeze({ ...this });
 *   }
 * };
 *
 * Copy.readonly(foo); // Call inside The Prtcl.toReadonly method.
 * ```
 */
export const toReadonlyClone = Symbol.for('Prtcl.toReadonlyClone')

/**
 * A method that returns the internal unwrap data of the object.
 * @example
 *
 * ```typescript
 * const foo = {
 *   date: new Date(),
 *   [Prtcl.toUnwrap]() {
 *     return { date: JSON.stringify(this.date) };
 *   }
 * };
 *
 * Serializer.unwrap(foo); // Call inside the Prtcl.toUnwrap method.
 * ```
 */
export const toUnwrap = Symbol.for('toUnwrap')

/**
 * A method that returns a JSON string representation of the object.
 * @example
 * ```typescript
 * const foo = {
 *   value: 'foo',
 *   [Prtcl.toSerialize]() {
 *     return JSON.stringify(this);
 *   }
 * };
 *
 * const json = Serializer.toJson(foo); // Call inside the Prtcl.toSerialize method.
 * ```
 */
// TODO: export const toSerialize = Symbol.for("Prtcl.toSerialize");

/**
 * A method that initializes the object from a JSON string.
 * @example
 * ```typescript
 * class Foo {
 * value: string
 *
 * constructor(value: string) {
 *     this.value = value
 * }
 *
 * static [Prtcl.fromSerialize](json: string) {
 *     return new Foo(JSON.parse(json));
 * }
 * };
 *
 * const obj = Serializer.fromJson(Foo, jsonString); // Call inside the Prtcl.fromSerialize method.
 * ```
 */
// TODO: export const fromSerialize = Symbol.for("Prtcl.fromSerialize");

// TODO: export const toLog = Symbol.for("Prtcl.toLog");

// TODO: export const resetThis = Symbol.for("Prtcl.resetThis");
