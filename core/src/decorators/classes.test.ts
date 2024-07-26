import { assert, assertEquals, assertInstanceOf } from 'jsr:@std/assert'
import { describe, test } from 'jsr:@std/testing/bdd'
import { cloneBy, compareBy, equalsBy, flatBy, mutableCloneBy, readonlyCloneBy } from './classes.ts'
import * as Prtcl from '../prtcl/mod.ts'
import type * as Extend from '../extend.ts'

describe('cloneBy decorator', () => {
	@cloneBy((instance) => new Foo(instance.value))
	class Foo<T> {
		value: T
		constructor(value: T) {
			this.value = value
		}
	}

	const foo = new Foo('foo')

	test('Should return true if foo implements clone protocol', () => {
		assert(Prtcl.impl('clone', foo))
	})

	test('Should be match if both object are equals', () => {
		const copy = (foo as Extend.Clone<Foo<string>>)[Prtcl.toClone]()
		assertEquals(copy, foo)
	})
})

describe('compareBy decorator', () => {
	@compareBy((instance, other: Foo) => instance.value - other.value)
	class Foo {
		value: number
		constructor(value: number) {
			this.value = value
		}
	}

	const foo = new Foo(12)

	test('Should return true if foo implements compare protocol', () => {
		assert(Prtcl.impl('compare', foo))
	})

	test('Should return diference in to both object', () => {
		const otherFoo = new Foo(34)

		assertEquals((foo as Extend.Compare<Foo, unknown>)[Prtcl.compareTo](otherFoo), -22)
	})
})

describe('equalsBy decorator', () => {
	@equalsBy((instance, other) => other instanceof Foo && instance.value === other.value)
	class Foo<T> {
		value: T
		constructor(value: T) {
			this.value = value
		}
	}

	const foo = new Foo('foo')

	test('Should return true if foo implements equals protocol', () => {
		assert(Prtcl.impl('equals', foo))
	})

	test('Should comarate with object and return true', () => {
		const otherFoo = new Foo('foo')
		assert((foo as Extend.Equals<Foo<string>>)[Prtcl.equalsTo](otherFoo))
	})
})

describe('unwrapBy decorator', () => {
	@flatBy((instance) => instance.value)
	class Foo<T> {
		value: T
		constructor(value: T) {
			this.value = value
		}
	}

	const foo = new Foo('foo')

	test('Should return true if foo implements unwrap protocol', () => {
		assert(Prtcl.impl('flat', foo))
	})

	test('Should return unwrap data of foo', () => {
		assertEquals((foo as Extend.Flat<Foo<string>, string>)[Prtcl.toFlat](), 'foo')
	})
})

describe('mutableCloneBy decorator', () => {
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

	@mutableCloneBy((instance) => new MutableList(instance.list))
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

	const list = new ReadonlyList(['foo', 'bar'])

	test('Should return true if list implements readonlyClone protocol', () => {
		assert(Prtcl.impl('mutableClone', list))
	})

	test('Should return readonly clone', () => {
		const mutableCopyList = (list as Extend.MutableClone<ReadonlyList<string>, MutableList<string>>)
			[Prtcl.toMutableClone]()
		const mutableList = new MutableList(['foo', 'bar'])

		assertInstanceOf(mutableCopyList, MutableList)
		assertEquals(mutableList, mutableCopyList)
	})
})

describe('readonlyCloneBy decorator', () => {
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
	@readonlyCloneBy((instance) => new ReadonlyList(instance.list))
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

	const list = new MutableList(['foo', 'bar'])

	test('Should return true if list implements readonlyClone protocol', () => {
		assert(Prtcl.impl('readonlyClone', list))
	})

	test('Should return readonly clone', () => {
		const readonlyCopyList = (list as Extend.ReadonlyClone<MutableList<string>, ReadonlyList<string>>)
			[Prtcl.toReadonlyClone]()
		const readonlyList = new ReadonlyList(['foo', 'bar'])

		assertInstanceOf(readonlyCopyList, ReadonlyList)
		assertEquals(readonlyList, readonlyCopyList)
	})
})
