import {
	assert,
	assertEquals,
	assertFalse,
	assertGreater,
	assertInstanceOf,
	assertLess,
	assertThrows,
} from 'jsr:@std/assert'
import { describe, test } from 'jsr:@std/testing/bdd'
import {
	defaultClone,
	defaultCompare,
	defaultEquals,
	defaultFlat,
	defaultMutableClone,
	defaultReadonlyClone,
} from './methods.ts'
import { getRandomInt, getRandomPrimitive } from 'test:utils'
import type { FlatData } from './types.ts'
import * as Prtcl from './prtcl/mod.ts'

describe('defaultClone', () => {
	test('Should thrown if called by a primitive', () => {
		assertThrows(() => (defaultClone.call('foo' as never)))
		assertThrows(() => (defaultClone.call(1 as never)))
	})

	test('Should clone plain object', () => {
		const obj = { value: 1 }

		assertEquals(obj, defaultClone.call(obj))
	})

	test('Should clone array', () => {
		const arr = [1, 2, 3]

		assertEquals(arr, defaultClone.call(arr))
		assert(Array.isArray(arr))
	})

	test('Should clone class instance', () => {
		class Foo<T> {
			value: T
			constructor(value: T) {
				this.value = value
			}
		}

		const foo = new Foo('foo')

		const fooClone = defaultClone.call(foo)

		assertEquals(foo, fooClone)
		assertInstanceOf(fooClone, Foo)
	})
})

describe('defaultCompare', () => {
	test('Should throw if called by non-parseable object to number', () => {
		const obj = {}

		assertThrows(() => (defaultCompare.call(obj, getRandomInt(0, 8))))
	})

	test('Should throw if called with non-parseable object to number', () => {
		const obj1 = { valueOf: () => getRandomInt(0, 8) }
		const obj2 = {}

		assertThrows(() => (defaultCompare.call(obj1, obj2)))
	})

	test('Should return 0 if the numerical value of both objects is the same', () => {
		const numValue = getRandomInt(0, 8)
		const obj1 = { valueOf: () => numValue }
		const obj2 = { [Symbol.toPrimitive]: () => numValue }

		assertEquals(defaultCompare.call(obj1, obj2), 0)
	})

	test('Should return negative value if first object are less than the second', () => {
		const numValue = getRandomInt(0, 8)
		const difference = getRandomInt(0, 7) + 1
		const obj1 = { valueOf: () => numValue }
		const obj2 = { [Symbol.toPrimitive]: () => numValue + difference }

		assertLess(defaultCompare.call(obj1, obj2), 0)
	})

	test('Should return positive value if first object are greater than the second', () => {
		const numValue = getRandomInt(0, 8)
		const difference = getRandomInt(0, 7) + 1
		const obj1 = { valueOf: () => numValue + difference }
		const obj2 = { [Symbol.toPrimitive]: () => numValue }

		assertGreater(defaultCompare.call(obj1, obj2), 0)
	})
})

describe('defaultEquals', () => {
	test('Should return false, if called with primitive', () => {
		const obj = {}
		const other = getRandomPrimitive()

		assertFalse(defaultEquals.call(obj, other))
	})

	test('Should return false, if called with other object', () => {
		const obj1 = {}
		const obj2 = {}

		assertFalse(defaultEquals.call(obj1, obj2))
	})

	test('Should return true, if called with the same object', () => {
		const obj = {}

		assert(defaultEquals.call(obj, obj))
	})
})

describe('defaultFlat', () => {
	test('Should return blank object, if called by blank object', () => {
		const obj = {}

		assertEquals(defaultFlat.call(obj) as object, {})
	})

	test('Should return copy of object with methods remove', () => {
		const obj = {
			property: 'foo',
			get getter() {
				return 'bar'
			},
			method() {
				return 'baz'
			},
		}

		assertEquals(defaultFlat.call(obj) as object, { property: 'foo', getter: 'bar' })
	})

	test('Should return object with bigint value property', () => {
		const obj = { property: 456n }

		assertEquals(defaultFlat.call(obj) as object, { property: 456n })
	})

	test('Should return object with symbol value property', () => {
		const sym = Symbol('test.sym')
		const obj = { property: sym }

		assertEquals(defaultFlat.call(obj) as object, { property: sym })
	})

	test('Should return deep flat object', () => {
		const obj = {
			foo: 'foo',
			bar: {
				method: () => 'bar',
				bar_prop: 'bar',
				baz: {
					get getter() {
						return 'baz'
					},
					baz_prop: 'baz',
				},
			},
		}

		assertEquals(defaultFlat.call(obj) as object, {
			foo: 'foo',
			bar: { bar_prop: 'bar', baz: { getter: 'baz', baz_prop: 'baz' } },
		})
	})

	test('Should return flat entries, if called with map', () => {
		const map = new Map([['prop1', 'foo'], ['prop2', 'bar']])

		assertEquals(defaultFlat.call(map), [['prop1', 'foo'], ['prop2', 'bar']])
	})

	test('Should return flat object, if called with class instance', () => {
		class Foo<T extends string, U extends string> {
			public: T
			#private: U
			constructor(_public: T, _private: U) {
				this.public = _public
				this.#private = _private
			}

			get private() {
				return this.#private
			}

			method() {
				return this.private + ' ' + this.public
			}
		}
		const foo = new Foo('hello', 'world')

		assertEquals(defaultFlat.call(foo), { public: 'hello', private: 'world' })
	})

	test('Should work with circular references', () => {
		const obj: Record<string, unknown> = {
			get value() {
				return "i'm the parent"
			},
		}

		obj.son = {
			parent: obj,
			get value() {
				return "i'm the son"
			},
		}

		const expectObj: Record<string, FlatData> = {
			value: "i'm the parent",
		}

		expectObj.son = {
			parent: expectObj,
			value: "i'm the son",
		}

		assertEquals(defaultFlat.call(obj), expectObj)
	})

	test('Should called "toJSON" method', () => {
		const date = new Date()

		assertEquals(defaultFlat.call(date), date.toJSON())

		const obj = { date }

		assertEquals(defaultFlat.call(obj), { date: date.toJSON() })
	})

	test('Should called Prtcl.toFlat method', () => {
		const flateable = { [Prtcl.toFlat]: () => "i'm flat" }

		assertEquals(defaultFlat.call(flateable), flateable[Prtcl.toFlat]())

		const obj = { son: flateable }

		assertEquals(defaultFlat.call(obj), { son: flateable[Prtcl.toFlat]() })
	})

	test('Should ignore Prtcl.toFlat and "toJSON" methods if they are the same function `defaultFlat`', () => {
		const flateable = { [Prtcl.toFlat]: defaultFlat, value: 'foo' }

		assertEquals(defaultFlat.call(flateable), { value: 'foo' })

		const jsonParseable = { toJSON: defaultFlat, value: 'foo' }

		assertEquals(defaultFlat.call(jsonParseable), { value: 'foo' })
	})

	describe('Unwrap Primivites objects', () => {
		test('Should return string if called by String object', () => {
			const str = Object('foo')

			assertEquals(defaultFlat.call(str), 'foo')
			assertEquals(defaultFlat.call({ str }), { str: 'foo' })
		})
		test('Should return string if called by Boolean object', () => {
			const bool = Object(false)
			assertEquals(defaultFlat.call(bool), false)
			assertEquals(defaultFlat.call({ bool }), { bool: false })
		})
		test('Should return string if called by Number object', () => {
			const num = Object(123)
			assertEquals(defaultFlat.call(num), 123)
			assertEquals(defaultFlat.call({ num }), { num: 123 })
		})
		test('Should return string if called by Symbol object', () => {
			const sym = Object(Symbol.for('test.sym'))
			assertEquals(defaultFlat.call(sym), Symbol.for('test.sym'))
			assertEquals(defaultFlat.call({ sym }), { sym: Symbol.for('test.sym') })
		})
		test('Should return string if called by BigInt object', () => {
			const int = Object(456n)
			assertEquals(defaultFlat.call(int), 456n)
			assertEquals(defaultFlat.call({ int }), { int: 456n })
		})
	})
})

describe('defaultMutableClone', () => {
	test('Should return blank object, if called by blank object', () => {
		const readonlyObj = Object.freeze({})

		assertEquals(defaultMutableClone.call(readonlyObj), {})
	})

	test('Should return mutable clone', () => {
		const readonlyObj = Object.freeze({})
		const clone = defaultMutableClone.call(readonlyObj) as Record<string, unknown>

		clone['foo'] = 'bar'

		assertEquals(clone, { foo: 'bar' })
	})
})

describe('defaultReadonlyClone', () => {
	test('Should return blank readonly object, if called by blank object', () => {
		const mutableObj = {}

		assertEquals(defaultReadonlyClone.call(mutableObj), {})
	})

	test('Should return readonly clone', () => {
		const mutableObj = {}
		const clone = defaultReadonlyClone.call(mutableObj) as Readonly<Record<string, unknown>>

		assertThrows(() => {
			// @ts-expect-error: This throws
			clone['foo'] = 'bar'
		})
	})
})
