export const PRIMITIVES_WRAPPERS_LIST = [Boolean, BigInt, Number, String, Symbol]

export type PrimitivesWrapper = (typeof PRIMITIVES_WRAPPERS_LIST)[number]['prototype']

export function clonePrimitivesWrappers<T extends PrimitivesWrapper>(value: T): T {
	return Object(value.valueOf())
}

export function isPrimitiveWrapper(value: object): value is PrimitivesWrapper {
	return PRIMITIVES_WRAPPERS_LIST.some((PW) => value instanceof PW)
}
