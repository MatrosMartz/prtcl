import type { IClone, ICompare, IEquals, IFlat, IMutableClone, IReadonlyClone } from './interfaces.ts'
import type { FlatData } from './types.ts'

/**
 * Adds `Prtcl.toClone` methods to the type passed to it.
 * @template T The type passed.
 */
export type Clone<T> = T & IClone<T>

/**
 * Adds `Prtcl.compareTo` methods to the type passed to it.
 * @template T The type passed.
 * @template U The other type.
 */
export type Compare<T, U> = T & ICompare<U>

/**
 * Adds `Prtcl.equalsTo` methods to the type passed to it.
 * @template T The type passed.
 */
export type Equals<T> = T & IEquals

/**
 * Adds `Prtcl.toFlat` methods to the type passed to it.
 * @template T The type passed.
 * @template Data The flattened data type.
 */
export type Flat<T, Data extends FlatData> = T & IFlat<Data>

/**
 * Adds `Prtcl.toMutable` methods to the type passed to it.
 * @template T The type passed.
 * @template MutableCopy The mutable copy type.
 */
export type MutableClone<T, MutableCopy> = T & IMutableClone<MutableCopy>

/**
 * Adds `Prtcl.toReadonly` methods to the type passed to it.
 * @template T The type passed.
 * @template ReadonlyCopy The readonly copy type.
 */
export type ReadonlyClone<T, ReadonlyCopy> = T & IReadonlyClone<ReadonlyCopy>
