import { assert, assertEquals, assertInstanceOf } from '@std/assert'
import { describe, test } from '@std/testing/bdd'
import { useCompareTo, useEqualsTo, useToClone, useToMutableClone, useToReadonlyClone, useToUnwrap } from './methods.ts'
import * as Prtcl from '../prtcl/mod.ts'
import type * as Extend from '../extend.ts'

describe('useToClone decorator', () => {
	class Foo<T> {
		value: T
		constructor(value: T) {
			this.value = value
		}

		@useToClone
		toClone() {
			return new Foo(this.value)
		}
	}

	const foo = new Foo('foo')

	test('Should return true if foo implements clone protocol', () => {
		assert(Prtcl.impl('clone', foo))
	})

	test('Should be match if both object are equals', () => {
		type FooToCopy = Extend.Clone<Foo<string>>

		const copy = (foo as FooToCopy)[Prtcl.toClone]('default')
		assertEquals(copy, foo)
	})
})

describe('useCompareTo decorator', () => {
	class Foo {
		value: number
		constructor(value: number) {
			this.value = value
		}

		@useCompareTo
		compareTo(other: Foo) {
			return this.value - other.value
		}
	}

	const foo = new Foo(12)

	test('Should return true if foo implements compare protocol', () => {
		assert(Prtcl.impl('compare', foo))
	})

	test('Should return diference in to both object', () => {
		const otherFoo = new Foo(34)

		type FooComapreTo = Extend.Compare<Foo, unknown>

		assertEquals((foo as FooComapreTo)[Prtcl.compareTo](otherFoo), -22)
	})
})

describe('useEqualsTo decorator', () => {
	class Foo<T> {
		value: T
		constructor(value: T) {
			this.value = value
		}

		@useEqualsTo
		equalsTo(other: unknown) {
			return other instanceof Foo && other.value === this.value
		}
	}

	const foo = new Foo('foo')

	test('Should return true if foo implements equals protocol', () => {
		assert(Prtcl.impl('equals', foo))
	})

	test('Should comarate with object and return true', () => {
		const otherFoo = new Foo('foo')
		type FooEqualsTO = Extend.Equals<Foo<string>>

		assert((foo as FooEqualsTO)[Prtcl.equalsTo](otherFoo))
	})
})

describe('useToMutable decorator', () => {
	class MutableList<T> {
		#list: T[]

		constructor(list: readonly T[]) {
			this.#list = [...list]
		}

		get list() {
			return [...this.#list]
		}

		get fisrtItem() {
			return this.#list[0]
		}

		get lastItem() {
			return this.#list[this.#list.length - 1]
		}

		add(item: T) {
			this.#list.push(item)
		}

		remove(item: T) {
			this.#list = this.#list.filter((it) => it !== item)
		}
	}

	class ReadonlyList<T> {
		readonly #list: readonly T[]

		constructor(list: readonly T[]) {
			this.#list = Object.freeze([...list])
		}

		get list() {
			return Object.freeze([...this.#list])
		}

		get fisrtItem() {
			return this.#list[0]
		}

		get lastItem() {
			return this.#list[this.#list.length - 1]
		}

		@useToMutableClone
		toMutableClone() {
			return new MutableList(this.#list)
		}
	}

	const list = new ReadonlyList(['foo', 'bar'])

	test('Should return true if list implements readonlyClone protocol', () => {
		assert(Prtcl.impl('mutableClone', list))
	})

	test('Should return readonly clone', () => {
		type ListToMutableClone = Extend.MutableClone<ReadonlyList<string>, MutableList<string>>

		const mutableCopyList = (list as ListToMutableClone)[Prtcl.toMutableClone]('default')
		const mutableList = new MutableList(['foo', 'bar'])

		assertInstanceOf(mutableCopyList, MutableList)
		assertEquals(mutableList, mutableCopyList)
	})
})

describe('useToReadonly decorator', () => {
	class ReadonlyList<T> {
		readonly #list: readonly T[]

		constructor(list: readonly T[]) {
			this.#list = Object.freeze([...list])
		}

		get list() {
			return Object.freeze([...this.#list])
		}

		get fisrtItem() {
			return this.#list[0]
		}

		get lastItem() {
			return this.#list[this.#list.length - 1]
		}
	}

	class MutableList<T> {
		#list: T[]

		constructor(list: readonly T[]) {
			this.#list = [...list]
		}

		get list() {
			return [...this.#list]
		}

		get fisrtItem() {
			return this.#list[0]
		}

		get lastItem() {
			return this.#list[this.#list.length - 1]
		}

		add(item: T) {
			this.#list.push(item)
		}

		remove(item: T) {
			this.#list = this.#list.filter((it) => it !== item)
		}

		@useToReadonlyClone
		toReadonlyClone() {
			return new ReadonlyList(this.#list)
		}
	}

	const list = new MutableList(['foo', 'bar'])

	test('Should return true if list implements readonlyClone protocol', () => {
		assert(Prtcl.impl('readonlyClone', list))
	})

	test('Should return readonly clone', () => {
		type ListToReadonlyClone = Extend.ReadonlyClone<MutableList<string>, ReadonlyList<string>>

		const readonlyCopyList = (list as ListToReadonlyClone)[Prtcl.toReadonlyClone]('default')
		const readonlyList = new ReadonlyList(['foo', 'bar'])

		assertInstanceOf(readonlyCopyList, ReadonlyList)
		assertEquals(readonlyList, readonlyCopyList)
	})
})

describe('useToUnwrap decorator', () => {
	class Foo<T> {
		value: T
		constructor(value: T) {
			this.value = value
		}

		@useToUnwrap
		toUnwrap() {
			return this.value
		}
	}

	const foo = new Foo('foo')

	test('Should return true if foo implements unwrap protocol', () => {
		assert(Prtcl.impl('unwrap', foo))
	})

	test('Should return unwrap data of foo', () => {
		type FooToUnwrap = Extend.Unwrap<Foo<string>, string>

		assertEquals((foo as FooToUnwrap)[Prtcl.toUnwrap](), 'foo')
	})
})
