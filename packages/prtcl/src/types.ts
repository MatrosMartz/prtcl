import type { Primitives } from './native/mod.ts'

/** Flat object type, only allows as values the same, plain array or primitives. */
export type FlatRecord = {
	readonly [key: string | number]: FlatData
}

/** Flat array type, only allows as values the same, plain record or primitives. */
export type FlatArray = ReadonlyArray<FlatData>

/** Flat object or Primitives. */
export type FlatData = FlatArray | FlatRecord | Primitives

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
