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
