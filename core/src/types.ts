import type { Primitives } from './native/mod.ts'

/** Flat object type, only allows as values the same, plain array or primitives. */
export type FlatRecord = {
	readonly [k: PropertyKey]: FlatData
}

/** Flat array type, only allows as values the same, plain record or primitives. */
export type FlatArray = ReadonlyArray<FlatData>

/** Flat object or Primitives. */
export type FlatData = FlatArray | FlatArray | Primitives

/** Type cloning. */
export type cloneHint = 'shallow' | 'deep'

/** Contrary to the type `Readonly`. */
export type Mutable<T> = { -readonly [k in keyof T]: T[k] }
