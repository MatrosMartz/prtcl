/**
 * This module defines the guard function: `impl`.
 * @module
 */

import { toObject } from '../utils.ts'
import type * as Extends from '../extend.ts'
import { compareTo, equalsTo, toClone, toMutableClone, toReadonlyClone, toUnwrap } from './symbols.ts'
import type { UnwrapData } from '../types.ts'

interface Implements<T = unknown> {
	clone: Extends.Clone<T>
	compare: Extends.Compare<T, unknown>
	equals: Extends.Equals<T>
	mutableClone: Extends.MutableClone<T, unknown>
	readonlyClone: Extends.ReadonlyClone<T, unknown>
	unwrap: Extends.Unwrap<T, UnwrapData>
}

export type ProtocolName = keyof Implements

/**
 * Checks whether an object implements a protocol.
 * @template T The object type.
 * @template PN The protocol name.
 * @param protocol The name of protocol.
 * @param value The object.
 * @return Guard if object implements protocol.
 */
export function impl<T, PN extends ProtocolName>(
	protocol: PN,
	value: T,
): value is Implements<T>[PN] {
	if (value == null) return false
	const obj = toObject(value)

	switch (protocol) {
		case 'clone':
			return toClone in obj && typeof obj[toClone] === 'function'
		case 'compare':
			return compareTo in obj && typeof obj[compareTo] === 'function'
		case 'equals':
			return equalsTo in obj && typeof obj[equalsTo] === 'function'
		case 'mutableClone':
			return toMutableClone in obj && typeof obj[toMutableClone] === 'function'
		case 'readonlyClone':
			return toReadonlyClone in obj && typeof obj[toReadonlyClone] === 'function'
		case 'unwrap':
			return toUnwrap in obj && typeof obj[toUnwrap] === 'function'
	}

	throw new Error(`The protocol: "${String(protocol)}" not exist in Prtcl`)
}
