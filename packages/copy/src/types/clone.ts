interface SuccessfulCloningResult<T> {
	value: T
	cloned: true
}

interface FailedCloningResult {
	cloned: false
}

export type CloningResult<T> = SuccessfulCloningResult<T> | FailedCloningResult
