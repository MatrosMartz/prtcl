import type { Primitives } from './native/mod.ts'

/** Unwrap object type, only allows as values the same, unwrap array or primitives. */
export type UnwrapRecord = {
	readonly [key: string | number]: UnwrapData
}

/** Unwrap array type, only allows as values the same, unwrap record or primitives. */
export type UnwrapArray = ReadonlyArray<UnwrapData>

/** Unwrap object or Primitives. */
export type UnwrapData = UnwrapArray | UnwrapRecord | Primitives

/** Type cloning. */
export type CloneHint = 'deep' | 'default' | 'shallow'

/** Contrary to the type `Readonly`. */
export type Mutable<T> = { -readonly [k in keyof T]: T[k] }

/**
 * Type for Classes.
 * @template T The instace type.
 */
// deno-lint-ignore no-explicit-any
export type Class<T = unknown> = new (...args: any[]) => T

/**
 * Gets the instace type of a class.
 * @template T The class.
 */
export type InstanceOf<T> = T extends Class<infer I> ? I : never
