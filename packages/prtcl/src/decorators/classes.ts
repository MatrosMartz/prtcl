/**

* This module defines decorators that recieve function to used as a prtcl methods.
* @module
 */

import type { Class, InstanceOf } from '../types.ts'
import * as Prtcl from '../prtcl/mod.ts'

type Decorator<T> = (target: T, ctx: DecoratorContext) => void | T

/**

* Ensured if context kind is class.
* @param ctx The decorator context.
* @param protocol The protocol name.
* @throws If context kind is not a class, throw error in message the protocol name.
 */
function ensuredIfIsClass(
	ctx: DecoratorContext,
	protocol: Prtcl.ProtocolName,
): asserts ctx is DecoratorContext & { kind: 'class' } {
	if (ctx.kind !== 'class') {
		throw new Error(`This decorator for the implementions of the "${protocol}" protocol its only avalible in classes`)
	}
}

/**

* The function receives instance and returns it's copy.
* @template T The instance type.
* @param instance The object to clone.
* @return new Copy of the instance.
 */
export type CloneByCallback<T> = (instance: T) => T

/**

* Add to class the `Prtcl.toClone` method.
* @template C The class type.
* @template T The instance type.
* @param callback The function receives instance and returns it's copy.
* @return Class decorator.
 */
export function cloneBy<C extends Class, T extends InstanceOf<C>>(
	callback: CloneByCallback<T>,
): Decorator<C> {
	return (target, ctx) => {
		ensuredIfIsClass(ctx, 'clone')

		Object.defineProperty(target.prototype, Prtcl.toClone, {
			value(this: T) {
				return callback(this)
			},
		})
	}
}

/**

* The function receives instance, other value and returns the diference in number value.
* @template T The instance type.
* @template U The other type.
* @param instance The principal object to comapre.
* @param other The object with compare the instance.
* @return The diference in number value.
 */
type CompareByCallback<T, U> = (instance: T, other: U) => number

/**

* Add to class the `Prtcl.compareTo` method.
* @template T The instance type.
* @param callback The function receives instance, other value and returns the diference in number value.
* @return Class decorator.
 */
export function compareBy<C extends Class, T extends InstanceOf<C>, U>(
	callback: CompareByCallback<T, U>,
): Decorator<C> {
	return (target, ctx) => {
		ensuredIfIsClass(ctx, 'compare')

		Object.defineProperty(target.prototype, Prtcl.compareTo, {
			value(this: T, other: U) {
				return callback(this, other)
			},
		})
	}
}

/**

* The function receives instance, and other value and returns if self ans other are equals.
* @template T The instance type.
* @param instance The principal object to compare.
* @param other The object with compare the instance.
* @return True, if both objects are equals, false otherwise.
 */
type EqualsByCallback<T> = (instance: T, other: unknown) => boolean

/**

* Add to class the `Prtcl.equalsTo` method.
* @template T The instance type.
* @param callback The function receives instance, and other value and returns if self ans other are equals.
* @return Class decorator.
 */
export function equalsBy<C extends Class, T extends InstanceOf<C>>(
	callback: EqualsByCallback<T>,
): Decorator<C> {
	return (target, ctx) => {
		ensuredIfIsClass(ctx, 'equals')

		Object.defineProperty(target.prototype, Prtcl.equalsTo, {
			value(this: T, other: unknown) {
				return callback(this, other)
			},
		})
	}
}

/**

* The function receives instance and returns it's mutable copy.
* @template T The instance type.
* @template U The mutable clone type.
* @param instance The object to create mutable clone.
* @return New mutable clone.
 */
type MutableCloneByCallback<T, U> = (instance: T) => U

/**

* Add to class the `Prtcl.toMutable` method.
* @template T The instance type.
* @param callback The function receives instance and returns it's mutable copy.
* @return Class decorator.
 */
export function mutableCloneBy<C extends Class, T extends InstanceOf<C>, U>(
	callback: MutableCloneByCallback<T, U>,
): Decorator<C> {
	return (target, ctx) => {
		ensuredIfIsClass(ctx, 'mutableClone')

		Object.defineProperty(target.prototype, Prtcl.toMutableClone, {
			value(this: T) {
				return callback(this)
			},
		})
	}
}

/**

* The function receives instance and returns it's readonly copy.
* @template T The instance type.
* @template U The readonly clone type.
* @param instance The object to create readonly clone.
* @return New readonly clone.
 */
type ReadonlyCloneByCallback<T, U> = (instance: T) => U

/**

* Add to class the `Prtcl.toReadonly` method.
* @template T The instance type.
* @param callback The function receives instance and returns it's readonly copy.
* @return Class decorator.
 */
export function readonlyCloneBy<C extends Class, T extends InstanceOf<C>, U>(
	callback: ReadonlyCloneByCallback<T, U>,
): Decorator<C> {
	return (value, ctx) => {
		ensuredIfIsClass(ctx, 'readonlyClone')

		Object.defineProperty(value.prototype, Prtcl.toReadonlyClone, {
			value(this: T) {
				return callback(this)
			},
		})
	}
}

/**

* The function receives instance and returns it's unwrap data.
* @template T The instance type.
* @template U The unwrap data.
* @param instance The object to optains data.
* @return The unwrap data.
 */
type UnwrapByCallback<T, U> = (instance: T) => U

/**

* Add to class the `Prtcl.toUnwrap` method.
* @template T The instance type.
* @param callback The function receives instance and returns it's unwrap data.
* @return Class decorator.
 */
export function unwrapBy<C extends Class, T extends InstanceOf<C>, U>(callback: UnwrapByCallback<T, U>): Decorator<C> {
	return (target, ctx) => {
		ensuredIfIsClass(ctx, 'unwrap')

		Object.defineProperty(target.prototype, Prtcl.toUnwrap, {
			value(this: T) {
				return callback(this)
			},
		})
	}
}
