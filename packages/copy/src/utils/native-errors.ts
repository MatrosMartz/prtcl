export const NATIVE_ERRORS_LIST = [
	Error,
	EvalError,
	RangeError,
	ReferenceError,
	SyntaxError,
	TypeError,
	URIError,
] as const

export type NativeError = (typeof NATIVE_ERRORS_LIST)[number]['prototype']

export function cloneNativeError<T extends NativeError>(value: T): T {
	const ErrConst = value.constructor as ErrorConstructor
	return Object.assign(new ErrConst(value.message, { cause: value.cause }), value)
}

export function isNativeError(value: object): value is NativeError {
	return NATIVE_ERRORS_LIST.some((NE) => value.constructor === NE)
}
