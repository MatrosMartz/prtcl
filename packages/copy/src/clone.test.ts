import { assert, assertEquals, assertInstanceOf } from '@std/assert'
import { describe, test } from '@std/testing/bdd'
import { assertSpyCall, assertSpyCalls, spy, stub } from '@std/testing/mock'
import { Prtcl } from '@prtcl/prtcl'
import type { Class, CloneHint } from '@prtcl/prtcl/types'

import { clone } from './clone.ts'
import { NATIVE_ERRORS_LIST } from './utils/native-errors.ts'
import type { PrimitivesWrapper } from './utils/primitive-wrappers.ts'

describe('clone method', () => {
	describe('with non-objects', () => {
		test('Should return the same string', () => {
			assertEquals('foo', clone('foo'))
			assertEquals('bar', clone('bar'))
		})

		test('Should return the same number', () => {
			assertEquals(123, clone(123))
			assertEquals(456, clone(456))
		})

		test('Should return the same boolean', () => {
			assertEquals(false, clone(false))
			assertEquals(true, clone(true))
		})

		test('Should return the same bigint', () => {
			assertEquals(123n, clone(123n))
			assertEquals(456n, clone(456n))
		})

		test('Should return nullish value', () => {
			assertEquals(null, clone(null))
			assertEquals(undefined, clone(undefined))
		})

		test('Should return the same symbol', () => {
			const sym = Symbol.for('test.sym')

			assertEquals(sym, clone(sym))
		})

		test('Should return the same function', () => {
			const foo = () => 'foo'

			assertEquals(foo, clone(foo))
		})
	})

	test('Should clone date', () => {
		const date = new Date()
		const dateClone = clone(date)

		assertEquals(date, dateClone)
		assert(date !== dateClone)
	})

	test('Should clone regex', () => {
		const rxg = /foo/ig
		const rgxClone = clone(rxg)

		assertEquals(rxg, rgxClone)
		assert(rxg !== rgxClone)
	})

	test('Should clone native error', () => {
		const RandomNativeError = NATIVE_ERRORS_LIST[Math.floor(Math.random() * NATIVE_ERRORS_LIST.length)]
		const err = new RandomNativeError('Some message', { cause: 'Ehh... idk' })
		const errClone = clone(err)

		assertEquals(err, errClone)
		assert(err !== errClone)
		assertInstanceOf(err, RandomNativeError)
	})

	test('Should clone non-native error as Error', () => {
		class CustomError extends Error {
			value: number
			constructor(message: string, value: number) {
				super(message)
				this.value = value
			}
		}
		const err = new CustomError('some message', 123)
		const errClone = clone(err)

		assertEquals(err.message, errClone.message)
		assertEquals(err.stack, errClone.stack)
	})

	test('Should clone primitive wrapper', () => {
		const PRIMITIVE_VALUES = ['foo', 'bar', 123, 456, true, false, null, undefined, 123n, 456n, Symbol.for('test.sym')]
		const randomPrimitiveValue = PRIMITIVE_VALUES[Math.floor(Math.random() * PRIMITIVE_VALUES.length)]
		const primitiveWrapper = Object(randomPrimitiveValue) as PrimitivesWrapper
		const primitiveWrapperClone = clone(primitiveWrapper)

		assertEquals(primitiveWrapper, primitiveWrapperClone)
		assert(primitiveWrapper !== primitiveWrapperClone)
		assertInstanceOf(primitiveWrapperClone, primitiveWrapper.constructor as Class<PrimitivesWrapper>)
	})

	test('Should call Prtcl.toClone method', () => {
		const objCloneMethod = spy<unknown, [hint: CloneHint]>()
		const obj = {
			value: 'foo',
			[Prtcl.toClone]: objCloneMethod,
		}
		const objClone = clone(obj)

		assertSpyCalls(objCloneMethod, 1)
		assertSpyCall(objCloneMethod, 0, { args: ['default'], returned: objClone })
	})

	test('Should call structuredClone', () => {
		using structuredCloneStub = stub(globalThis, 'structuredClone')
		const blob = new Blob(['foo'], { type: 'text/plain' })
		clone(blob)

		assertSpyCalls(structuredCloneStub, 1)
		assertSpyCall(structuredCloneStub, 0, { args: [blob] })
	})

	test('Should return shallow copy of plain object', () => {
		const obj = { foo: 'foo', bar: { value: 'bar' } }
		const objClone = clone(obj)

		assertEquals(obj, objClone)
		assert(obj !== objClone)
		assert(obj.bar === objClone.bar)
	})

	test('Should return shallow copy of plain array', () => {
		const arr = ['foo', ['bar']]
		const arrClone = clone(arr)

		assertEquals(arr, arrClone)
		assert(arr !== arrClone)
		assert(arr[1] === arrClone[1])
	})

	test('Should return shallow copy of Set object', () => {
		const obj = { bar: 'bar' }
		const set = new Set(['foo', obj])
		const setClone = clone(set)

		assertEquals(set, setClone)
		assert(set !== setClone)
		assert(setClone.has(obj))
	})

	test('Should return shallow copy of Map object', () => {
		const obj = { bar: 'bar' }
		const map = new Map<string, unknown>([['foo', 1], ['bar', obj]])
		const mapClone = clone(map)

		assertEquals(map, mapClone)
		assert(map !== mapClone)
		assert(map.get('bar') === mapClone.get('bar'))
	})
})

describe('clone.deep', () => {
	test('Should call Prtcl.toClone method', () => {
		const objCloneMethod = spy<unknown, [hint: CloneHint]>()
		const obj = { [Prtcl.toClone]: objCloneMethod }
		clone.deep(obj)

		assertSpyCalls(objCloneMethod, 1)
		assertSpyCall(objCloneMethod, 0, { args: ['deep'] })
	})

	test('Should call deeply Prtcl.toClone method', () => {
		const fooCloneMethod = spy<unknown, [hint: CloneHint]>()
		const obj = { foo: { [Prtcl.toClone]: fooCloneMethod } }
		clone.deep(obj)

		assertSpyCalls(fooCloneMethod, 1)
		assertSpyCall(fooCloneMethod, 0, { args: ['deep'] })
	})

	test('Should call structuredClone', () => {
		using structuredCloneStub = stub(globalThis, 'structuredClone')
		const blob = new Blob(['foo'], { type: 'text/plain' })
		clone.deep(blob)

		assertSpyCalls(structuredCloneStub, 1)
		assertSpyCall(structuredCloneStub, 0, { args: [blob] })
	})
})

describe('clone.shallow', () => {
	describe('with non-objects', () => {
		test('Should return the same string', () => {
			assertEquals('foo', clone.shallow('foo'))
			assertEquals('bar', clone.shallow('bar'))
		})

		test('Should return the same number', () => {
			assertEquals(123, clone.shallow(123))
			assertEquals(456, clone.shallow(456))
		})

		test('Should return the same boolean', () => {
			assertEquals(false, clone.shallow(false))
			assertEquals(true, clone.shallow(true))
		})

		test('Should return the same bigint', () => {
			assertEquals(123n, clone.shallow(123n))
			assertEquals(456n, clone.shallow(456n))
		})

		test('Should return nullish value', () => {
			assertEquals(null, clone.shallow(null))
			assertEquals(undefined, clone.shallow(undefined))
		})

		test('Should return the same symbol', () => {
			const sym = Symbol.for('test.sym')

			assertEquals(sym, clone.shallow(sym))
		})

		test('Should return the same function', () => {
			const foo = () => 'foo'

			assertEquals(foo, clone.shallow(foo))
		})
	})

	test('Should clone.shallow date', () => {
		const date = new Date()
		const dateClone = clone.shallow(date)

		assertEquals(date, dateClone)
		assert(date !== dateClone)
	})

	test('Should clone regex', () => {
		const rxg = /foo/ig
		const rgxClone = clone.shallow(rxg)

		assertEquals(rxg, rgxClone)
		assert(rxg !== rgxClone)
	})

	test('Should clone native error', () => {
		const RandomNativeError = NATIVE_ERRORS_LIST[Math.floor(Math.random() * NATIVE_ERRORS_LIST.length)]
		const err = new RandomNativeError('Some message', { cause: 'Ehh... idk' })
		const errClone = clone.shallow(err)

		assertEquals(err, errClone)
		assert(err !== errClone)
		assertInstanceOf(err, RandomNativeError)
	})

	test('Should clone non-native error as Error', () => {
		class CustomError extends Error {
			value: number
			constructor(message: string, value: number) {
				super(message)
				this.value = value
			}
		}
		const err = new CustomError('some message', 123)
		const errClone = clone.shallow(err)

		assertEquals(err.message, errClone.message)
		assertEquals(err.stack, errClone.stack)
	})

	test('Should clone primitive wrapper', () => {
		const PRIMITIVE_VALUES = ['foo', 'bar', 123, 456, true, false, null, undefined, 123n, 456n, Symbol.for('test.sym')]
		const randomPrimitiveValue = PRIMITIVE_VALUES[Math.floor(Math.random() * PRIMITIVE_VALUES.length)]
		const primitiveWrapper = Object(randomPrimitiveValue) as PrimitivesWrapper
		const primitiveWrapperClone = clone.shallow(primitiveWrapper)

		assertEquals(primitiveWrapper, primitiveWrapperClone)
		assert(primitiveWrapper !== primitiveWrapperClone)
		assertInstanceOf(primitiveWrapperClone, primitiveWrapper.constructor as Class<PrimitivesWrapper>)
	})

	test('Should call Prtcl.toClone method', () => {
		const objCloneMethod = spy<unknown, [hint: CloneHint]>()
		const obj = {
			value: 'foo',
			[Prtcl.toClone]: objCloneMethod,
		}
		const objClone = clone.shallow(obj)

		assertSpyCalls(objCloneMethod, 1)
		assertSpyCall(objCloneMethod, 0, { args: ['shallow'], returned: objClone })
	})

	test('Should call structuredClone', () => {
		using structuredCloneStub = stub(globalThis, 'structuredClone')
		const blob = new Blob(['foo'], { type: 'text/plain' })
		clone.shallow(blob)

		assertSpyCalls(structuredCloneStub, 1)
		assertSpyCall(structuredCloneStub, 0, { args: [blob] })
	})

	test('Should return shallow copy of plain object', () => {
		const obj = { foo: 'foo', bar: { value: 'bar' } }
		const objClone = clone.shallow(obj)

		assertEquals(obj, objClone)
		assert(obj !== objClone)
		assert(obj.bar === objClone.bar)
	})

	test('Should return shallow copy of plain array', () => {
		const arr = ['foo', ['bar']]
		const arrClone = clone.shallow(arr)

		assertEquals(arr, arrClone)
		assert(arr !== arrClone)
		assert(arr[1] === arrClone[1])
	})

	test('Should return shallow copy of Set object', () => {
		const obj = { bar: 'bar' }
		const set = new Set(['foo', obj])
		const setClone = clone.shallow(set)

		assertEquals(set, setClone)
		assert(set !== setClone)
		assert(setClone.has(obj))
	})

	test('Should return shallow copy of Map object', () => {
		const obj = { bar: 'bar' }
		const map = new Map<string, unknown>([['foo', 1], ['bar', obj]])
		const mapClone = clone.shallow(map)

		assertEquals(map, mapClone)
		assert(map !== mapClone)
		assert(map.get('bar') === mapClone.get('bar'))
	})
})
