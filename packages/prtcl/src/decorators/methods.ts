/**
 * This module defines decorators that use the decorated method as the value of the prtcl methods.
 * @module
 */

import * as Prtcl from '../prtcl/mod.ts'
/**
 * Ensured if field or method is a function.
 * @param value The field or method.
 * @param protocol The protocol name.
 * @throws If the value not is a function, throw error in message the protocol name.
 */
function checkIfIsFunction(
	value: unknown,
	protocol: Prtcl.ProtocolName,
): asserts value is (...args: unknown[]) => unknown {
	if (typeof value !== 'function') {
		throw new Error(
			`This decorator for the implementions of the"${protocol}" protocol its only avalible for class methods`,
		)
	}
}

/**
 * Use the method class as `Prtcl.toClone` method.
 * @param target The method that returns it's copy.
 * @param ctx The decorator context.
 */
export function useToClone(target: () => unknown, ctx: DecoratorContext): void {
	checkIfIsFunction(target, 'clone')

	ctx.addInitializer(function () {
		Object.defineProperty(this, Prtcl.toClone, { value: target })
	})
}

/**
 * Use the method that to passed as `Prtcl.compareTo` method.
 * @param value The method receives other value and returns diference in number value.
 * @param ctx The decorator context.
 */
export function useCompareTo<T>(value: (other: T) => number, ctx: DecoratorContext): void {
	checkIfIsFunction(value, 'compare')

	ctx.addInitializer(function () {
		Object.defineProperty(this, Prtcl.compareTo, { value })
	})
}

/**
 * Use the method that to passed as `Prtcl.equalsTo` method.
 * @param value The method receives other value and returns if self and other are equals.
 * @param ctx The decorator context.
 */
export function useEqualsTo(value: (other: unknown) => boolean, ctx: DecoratorContext): void {
	checkIfIsFunction(value, 'equals')

	ctx.addInitializer(function () {
		Object.defineProperty(this, Prtcl.equalsTo, { value })
	})
}

/**
 * Use the method that to passed as `Prtcl.toFlat` method.
 * @param target The method that returns it's flat data.
 * @param ctx The decorator context.
 */
export function useToFlat(target: () => unknown, ctx: DecoratorContext): void {
	checkIfIsFunction(target, 'flat')

	ctx.addInitializer(function () {
		Object.defineProperty(this, Prtcl.toFlat, { value: target })
	})
}

/**
 * Use the method that to passed as `Prtcl.toMutable` method.
 * @param target The method that returns it's mutable copy.
 * @param ctx The decorator context.
 */
export function useToMutableClone(target: () => unknown, ctx: DecoratorContext): void {
	checkIfIsFunction(target, 'mutableClone')

	ctx.addInitializer(function () {
		Object.defineProperty(this, Prtcl.toMutableClone, { value: target })
	})
}

/**
 * Use the method that to passed as `Prtcl.toReadonly` method.
 * @param target The method that returns it's readonly copy.
 * @param ctx The decorator context.
 */
export function useToReadonlyClone(target: () => unknown, ctx: DecoratorContext): void {
	checkIfIsFunction(target, 'readonlyClone')

	ctx.addInitializer(function () {
		Object.defineProperty(this, Prtcl.toReadonlyClone, { value: target })
	})
}
