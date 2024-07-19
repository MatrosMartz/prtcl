/**
 * Gets any value and returns it as an object.
 * @param value The any value non-nullable.
 * @returns The value if it's object or function, if it's a primitive transform into an object.
 */
export function toObject(value: NonNullable<unknown>): object {
	const type = typeof value

	if (type === 'function' || type === 'object') return value
	return Object.assign(value)
}

export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
	return typeof value === 'object'
}
