/** The primitives types. */
export type Primitives =
	| bigint
	| boolean
	| number
	| null
	| string
	| symbol
	| undefined

/**
 * Type for rest args of `ReplaceReplacer`.
 * @param patterns Contains the strings found by capture groups.
 * @param offset The position of substring.
 * @param originalString The whole string being examined.
 * @param groups An object whose keys are the used group names, and whose values are the matched portions (`undefined` if not matched).
 * @return The replacement string.
 */
export type ReplaceReplacerArgs = [
	...patterns: string[],
	offset: number,
	originalString: string,
	groups: Record<string, string> | undefined,
]

/**
 * Type for second param of `Symbol.replace` method, if it's a function.
 * @param substring The matched substring.
 * @param patterns Contains the strings found by capture groups.
 * @param offset The position of substring.
 * @param originalString The whole string being examined.
 * @param groups An object whose keys are the used group names, and whose values are the matched portions (`undefined` if not matched).
 * @return The replacement string.
 */
export type ReplaceReplacer = (
	substring: string,
	...args: ReplaceReplacerArgs
) => string

/** Type for hint param of `Symbol.toPrimitive` method. */
export type ToPrimitiveHint = 'default' | 'number' | 'string'

/** Type for value of `Symbol.Unscopable`. */
export type UnscopableRecord<T> = {
	readonly [k in keyof T]: boolean
}

// deno-lint-ignore no-explicit-any
export type Class<T = unknown> = new (...args: any[]) => T

export type InstanceOf<T> = T extends Class<infer I> ? I : never
