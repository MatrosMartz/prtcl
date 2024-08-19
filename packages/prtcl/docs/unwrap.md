# Unwrap

<!--toc:start-->

## Table of Contents

- [Unwrap](#unwrap)
  - [Overview](#overview)
    - [Symbol](#symbol)
    - [Definition](#definition)
    - [Guard](#guard)
    - [Type Assertion](#type-assertion)
    - [Default method](#default-method)
  - [Implementations](#implementations)
    - [Interface](#interface)
    - [Abstract Class](#abstract-class)
    - [Base Class](#base-class)
    - [Class Decorator](#class-decorator)
    - [Method decorator](#method-decorator)

<!--toc:end-->

Method used to obtain a plain data of object.

This method is similar to the `toJSON` method, which some native objects implement. However `toJSON` does not seem to be
intended as a standard for data serialization, and the javascript committee prefers that users implement their own
methods to achieve this.

An important difference is that this method, unlike `toJSON`, this method can return symbols and bigints, primitives not
supported in JSON files.

Well, you could use this method to standardise the serialisation of your objects in your application _wink wink_.

## Overview

### Symbol

Its symbol is located inside the Prtcl object:

```typescript
import { Prtcl } from 'prtcl'

Prtcl.toUnwrap
```

### Definition

This interface defines how to implement the method:

```typescript
interface IUnwrap<Data extends UnwrapData> {
	[Prtcl.toUnwrap](): Data
}
```

### Guard

You can check if an object implements it in the following way:

```typescript
if (Prtcl.impl('unwrap', obj)) {
	// obj implements unwrap method
}
```

### Type Assertion

You can add a method to a type using this type assertion:

```typescript
import { Extend } from 'prtcl'

declare const foo: Set<number>

foo as Extend.Unwrap<Set<number>, number[]> // Set<number> & { [Prtcl.toUnwrap](): number[] }
```

### Default method

Basic method to unwrap an object, not recommended for direct use.

```typescript
// Definition
import type { UnwrapData } from 'prtcl/types'

export function defaultUnwrap<T>(this: T): UnwrapData {
	return JSON.parse(JSON.stringify(this))
}

// use
import { defaultUnwrap } from 'prtcl/methods'

class Notes {
	notes: string[] = []

	add(note: string) {
		notes.push(note)
	}

	remove(note: string) {
		notes = notes.filter((n) => note === n)
	}

	[Prtcl.toUnwrap] = defaultUnwrap
}
```

This method follows the following steps:

- If it is a primitive, it returns it as is.

```typescript
console.log(defaultUnwrap.call('foo')) // Throws

const obj = { foo: 'foo' }

console.log(defaultUnwrap.call(obj)) // Object { foo: 'foo' }
```

- If it is a function, it returns undefined.

```typescript
console.log(defaultUnwrap.call(() => {})) // undefined

const obj = { foo: () => {} }

console.log(defaultUnwrap.call(obj)) // Object { }
```

- If the object extends wrapper classes (e.g. Number, String), it returns its primitive value.

```typescript
console.log(defaultUnwrap.call(new String('foo'))) // 'foo'

const obj = { foo: new String('foo') }

console.log(defaultUnwrap.call(obj)) // Object { foo: 'foo' }
```

- If the object has the `toJSON` method, it returns its result.

```typescript
console.log(defaultUnwrap.call(new Date('2024-07-31'))) // '2024-07-31T00:32:00.000Z'

const obj = { date: new Date('2024-07-31') }

console.log(defaultUnwrap.call(obj)) // Object { date: '2024-07-31T00:32:00.000Z' }
```

- If the object is iterable, it transforms it into an array (e.g. Maps and Sets).

```typescript
console.log(defaultUnwrap.call(new Map([['foo', 1], ['bar', 2]]))) // Array [['foo', 1], ['bar', 2]]

const obj = { list: new Set(['foo', 'bar']) }

console.log(defaultUnwrap.call(obj)) // Object { list: Array ['foo', 'bar'] }
```

- In any other case, it returns a unwrap object.

```typescript
class Foo<T> {
	value: T
	constructor(value: T) {
		this.value = value
	}
}

console.log(defaultUnwrap.call(new Foo('foo'))) // Object { value: 'foo' }

const obj = { foo: new Foo('foo') }

console.log(defaultUnwrap.call(obj)) // Object { foo: Object { value: 'foo' } }
```

## Implementations

### Interface

Interface that defines how to implement the unwrap method. See [definition](#definition).

```typescript
import type { IUnwrap } from 'prtcl/interfaces'

type NotesData = string[]

class Notes implements IUnwrap<string[]> {
	notes: string[] = []

	add(note: string) {
		notes.push(note)
	}

	remove(note: string) {
		notes = notes.filter((n) => note === n)
	}

	[Prtcl.toUnwrap]() {
		return this.notes
	}
}
```

### Abstract Class

Abstract Class that defines how to implement the unwrap method.

```typescript
import type { Unwrapeable } from 'prtcl/classes'

class Notes implements Unwrapeable<string[]> {
	notes: string[] = []

	add(note: string) {
		notes.push(note)
	}

	remove(note: string) {
		notes = notes.filter((n) => note === n)
	}

	[Prtcl.toUnwrap]() {
		return this.notes
	}
}
```

### Base Class

Class with a basic implementation of the unwrap method. Uses the [defaultUnwrap](#default-method) internally.

```typescript
import { BaseUnwrapeable } from 'prtcl/classes'

class Notes implements BaseUnwrapeable {
	notes: string[] = []

	add(note: string) {
		notes.push(note)
	}

	remove(note: string) {
		notes = notes.filter((n) => note === n)
	}
}
```

### Class Decorator

Class decorator that receives a function to define how to unwrap the object.

This implementation does not provide typing over the method.

```typescript
import { unwrapBy } from 'prtcl/decorators'

@unwrapBy((instance) => instance.notes)
class Notes {
	notes: string[] = []

	add(note: string) {
		notes.push(note)
	}

	remove(note: string) {
		notes = notes.filter((n) => note === n)
	}
}
```

### Method decorator

Method decorator that uses the method as the value of `Prtcl.toUnwrap`.

This implementation does not provide typing over the method.

```typescript
import { useToUnwrap } from 'prtcl/decorators'

class Notes {
	notes: string[] = []

	add(note: string) {
		notes.push(note)
	}

	remove(note: string) {
		notes = notes.filter((n) => note === n)
	}

	@useToUnwrap
	customUnwrap() {
		return this.notes
	}
}
```
