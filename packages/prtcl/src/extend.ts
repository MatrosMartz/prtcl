/**

* Contains types of each method for type assertion.
* @module
 */

import type { IClone, ICompare, IEquals, IMutableClone, IReadonlyClone, IUnwrap } from './interfaces.ts'
import type { UnwrapData } from './types.ts'

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

/**

* Adds `Prtcl.toUnwrap` methods to the type passed to it.
* @template T The type passed.
* @template Data The unwrapened data type.
 */
export type Unwrap<T, Data extends UnwrapData> = T & IUnwrap<Data>
