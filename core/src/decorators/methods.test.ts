import { assert, assertEquals, assertInstanceOf, assertObjectMatch } from 'jsr:@std/assert'
import { useCompareTo, useEqualsTo, useToClone, useToFlat, useToMutableClone, useToReadonlyClone } from './methods.ts'
import * as Prtcl from '../prtcl/mod.ts'
import type * as Extend from '../extend.ts'

Deno.test('Methods decorators', async (t) => {
	await t.step('useToClone decorator', async (t) => {
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

		await t.step('Should return true if foo implements clone protocol', () => {
			assert(Prtcl.impl('clone', foo))
		})

		await t.step('Should be match if both object are equals', () => {
			const copy = (foo as Extend.Clone<Foo<string>>)[Prtcl.toClone]()
			assertObjectMatch(copy, foo as never)
		})
	})

	await t.step('useCompareTo decorator', async (t) => {
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

		await t.step('Should return true if foo implements compare protocol', () => {
			assert(Prtcl.impl('compare', foo))
		})

		await t.step('Should return diference in to both object', () => {
			const otherFoo = new Foo(34)

			assertEquals((foo as Extend.Compare<Foo, unknown>)[Prtcl.compareTo](otherFoo), -22)
		})
	})

	await t.step('useEqualsTo decorator', async (t) => {
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

		await t.step('Should return true if foo implements equals protocol', () => {
			assert(Prtcl.impl('equals', foo))
		})

		await t.step('Should comarate with object and return true', () => {
			const otherFoo = new Foo('foo')
			assert((foo as Extend.Equals<Foo<string>>)[Prtcl.equalsTo](otherFoo))
		})
	})

	await t.step('useToUnwrap decorator', async (t) => {
		class Foo<T> {
			value: T
			constructor(value: T) {
				this.value = value
			}

			@useToFlat
			toUnwrap() {
				return this.value
			}
		}

		const foo = new Foo('foo')

		await t.step('Should return true if foo implements unwrap protocol', () => {
			assert(Prtcl.impl('flat', foo))
		})

		await t.step('Should return unwrap data of foo', () => {
			assertEquals((foo as Extend.Flat<Foo<string>, string>)[Prtcl.toFlat](), 'foo')
		})
	})

	await t.step('useToMutable decorator', async (t) => {
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

		await t.step('Should return true if list implements readonlyClone protocol', () => {
			assert(Prtcl.impl('mutableClone', list))
		})

		await t.step('Should return readonly clone', () => {
			const mutableCopyList = (list as Extend.MutableClone<ReadonlyList<string>, MutableList<string>>)
				[Prtcl.toMutableClone]()
			const mutableList = new MutableList(['foo', 'bar'])

			assertInstanceOf(mutableCopyList, MutableList)
			assertObjectMatch(mutableList, mutableCopyList as never)
		})
	})

	await t.step('useToReadonly decorator', async (t) => {
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

		await t.step('Should return true if list implements readonlyClone protocol', () => {
			assert(Prtcl.impl('readonlyClone', list))
		})

		await t.step('Should return readonly clone', () => {
			const readonlyCopyList = (list as Extend.ReadonlyClone<MutableList<string>, ReadonlyList<string>>)
				[Prtcl.toReadonlyClone]()
			const readonlyList = new ReadonlyList(['foo', 'bar'])

			assertInstanceOf(readonlyCopyList, ReadonlyList)
			assertObjectMatch(readonlyList, readonlyCopyList as never)
		})
	})
})
