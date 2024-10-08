# Mutable Clone

<!--toc:start-->

## Table of Contents

- [Mutable Clone](#mutable-clone)
  - [Overview](#overview)
    - [Symbol](#symbol)
    - [Definition](#definition)
    - [Guard](#guard)
    - [Type Assertion](#type-assertion)
    - [Default Method](#default-method)
  - [Implementations](#implementations)
    - [Interface](#interface)
    - [Abstract Class](#abstract-class)
    - [Base Class](#base-class)
    - [Class Decorator](#class-decorator)
    - [Method decorator](#method-decorator)

<!--toc:end-->

Method used to obtain a mutable copy of the object.

Its use is intended for cases such as `Map` and `Set` objects, which modify their data through methods, that lack a
native way to create a read-only copy.

It receives as a single argument the cloning mode hint, which can have the following values: _shallow_, _deep_, or
_default_.

## Overview

### Symbol

Its symbol is located inside the Prtcl object:

```typescript
import { Prtcl } from 'prtcl'

Prtcl.toMutableClone
```

### Definition

This interface defines how to implement the method:

```typescript
interface IMutableClone<MutableClone> {
	[Prtcl.toMutableClone](hint: 'default' | 'deep' | 'shallow'): MutableClone
}
```

### Guard

You can check if an object implements it in the following way:

```typescript
if (Prtcl.impl('mutableClone', obj)) {
	// obj implements mutable clone method
}
```

### Type Assertion

You can add a method to a type using this type assertion:

```typescript
import { Extend } from "prtcl";

declare const foo: ReadonlySet<number>;

foo as Extend.MutableClone<ReadonlySet<number>, Set<number>;
// ReadonlySet<number> & { [Prtcl.toMutableClone](hint): Set<number> }
```

### Default Method

Basic method to mutable clone an object, not recommended for direct use.

```typescript
// Definition
type Mutable<T> = { -readonly [K in keyof T]: T[K] }

export function defaultMutableClone<T extends object>(this: T): Mutable<T> {
	if (Array.isArray(this)) return [...this] as T
	return { ...this }
}

// Use
import { defaultMutableClone } from 'prtcl/methods'

class ReadonlyUser {
	readonly id: string
	readonly email: string
	readonly name: string

	constructor(id: string, email: string, name: string) {
		this.id = id
		this.email = email
		this.name = name
	}

	[Prtcl.toMutableClone] = defaultMutableClone
}
```

If no hint value is passed, it is _default_. If the hint is _default_, it returns a shallow clone (the same with the
_shallow_ hint).

This method follows the following steps:

- If it is a primitive, it returns it.

```typescript
console.log(defaultClone.call('foo')) // Throws

const obj = { foo: 'foo' }

console.log(defaultClone.call(obj)) // Object { foo: 'foo' }
```

- If it is a function, it returns it.

```typescript
console.log(defaultClone.call(() => 'foo')) // Function () => 'foo'

const obj = { foo: () => 'foo' }

console.log(defaultClone.call(obj)) // Object { foo: Function () => 'foo' }
```

- If it is an object or array, it creates a mutable copy.

```typescript
console.log(defaultClone.call(Object.freeze(['foo', 'bar']))) // Array ['foo', 'bar']

const obj = Object.freeze({ foo: 'foo' })

const clone = defaultClone.call(obj)

console.log(clone) // Object { foo: 'foo' }
console.log(Object.isFrozen(clone)) // false
```

## Implementations

### Interface

Interface that defines how to implement the mutable clone method. See [definition](#definition).

```typescript
import type { IMutableClone } from 'prtcl/interfaces'

declare class List {
	constructor(list: string[])

	get list(): string[]

	addd(item: string): void

	remove(item: string)
	void
}

class ReadonlyList implements IMutableClone<List> {
	constructor(list: string[]) {
		// ...
	}

	get list() {
		// ...
	}

	[Prtcl.toMutableClone]() {
		return new List(this.list)
	}
}
```

### Abstract Class

Abstract Class that defines how to implement the mutable clone method.

```typescript
import { MutableClonable } from 'prtcl/classes'

class ReadonlyList implements MutableClonable<List> {
	constructor(list: string[]) {
		// ...
	}

	get list() {
		// ...
	}

	[Prtcl.toMutableClone]() {
		return new List(this.list)
	}
}
```

### Base Class

Class with a basic implementation of the clone method. Uses the [defaultClone](#default-method) internally.

```typescript
import { BaseMutableClonable } from 'prtcl/classes'

class ReadonlyUser extends BaseMutableClonable {
	readonly id: string
	readonly email: string
	readonly name: string

	constructor(id: string, email: string, name: string) {
		this.id = id
		this.email = email
		this.name = name
	}
}
```

### Class Decorator

Class decorator that receives a function to define how to clone the object.

This implementation does not provide typing over the method.

```typescript
import { mutableCloneBy } from 'prtcl/methods'

declare class List {
	constructor(list: string[])

	get list(): string[]

	addd(item: string): void

	remove(item: string)
	void
}

@mutableCloneBy((instance) => new Foo(instance.list))
class ReadonlyList {
	constructor(list: string[]) {
		// ...
	}

	get list() {
		// ...
	}
}
```

### Method decorator

Method decorator that uses the method as the value of `Prtcl.toReadonlyClone`.

This implementation does not provide typing over the method.

```typescript
import { useToMutableClone } from 'prtcl/methods'

declare class List {
	constructor(list: string[])

	get list(): string[]

	addd(item: string): void

	remove(item: string)
	void
}

class ReadonlyList {
	constructor(list: string[]) {
		// ...
	}

	get list() {
		// ...
	}

	@useToMutableClone
	customMutableClone() {
		return new List(this.list)
	}
}
```
