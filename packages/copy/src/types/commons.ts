export interface CloneStackItem {
	value: unknown
	parent: object
	key: unknown
	type: 'head' | 'body' | 'tail'
}

export type CloneStackObject = Record<string, unknown> | unknown[] | Map<unknown, unknown> | Set<unknown>
