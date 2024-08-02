# Read-only clone

<!--toc:start-->

## Table of Contents

- [Read-only clone](#read-only-clone)
  - [Overview](#overview)
    - [Symbol](#symbol)
    - [Definition](#definition)
    - [Guard](#guard)
    - [Type Assertion](#type-assertion)
    - [Default Method](#default-method)
  - [Clone Implementations](#clone-implementations)
    - [Clone Interface](#clone-interface)
    - [Clone Abstract Class](#clone-abstract-class)
    - [Base Class](#base-class)
    - [Class Decorator](#class-decorator)
    - [Method decorator](#method-decorator)

<!--toc:end-->

Method used to obtain a read-only copy of the object.

Its use is intended for cases such as `Map` and `Set` objects, which modify their data through methods, that lack a
native way to create a read-only copy.

It receives as a single argument the cloning mode hint, which can have the following values: _shallow_, _deep_, or
_default_.

## Overview

### Symbol

Its symbol is located inside the Prtcl object:

```typescript
import { Prtcl } from 'prtcl'

Prtcl.toReadonlyClone
```

### Definition

This interface defines how to implement the method:

```typescript
interface IReadonlyClone<ReadonlyClone> {
	[Prtcl.toReadonlyClone](hint: 'default' | 'deep' | 'shallow'): ReadonlyClone
}
```

### Guard

You can check if an object implements it in the following way:

```typescript
if (Prtcl.impl('readonlyClone', obj)) {
	// obj implements readonly clone method
}
```

### Type Assertion

You can add a method to a type using this type assertion:

```typescript
import { Extend } from "prtcl";

declare const foo: Set<number>;

foo as Extend.ReadonlyClone<Set<number>, ReadonlySet<number>;
// Set<number> & { [Prtcl.toReadonlyClone](hint): ReadonlySet<number> }
```

### Default Method

Basic method to readonly clone an object, not recommended for direct use.

```typescript
// Definition
export function defaultReadonlyClone<T extends object>(this: T): Mutable<T> {
	if (Array.isArray(this)) return Object.freeze([...this] as T)
	return Object.freeze({ ...this })
}

// Use
import { defaultReadonlyClone } from 'prtcl/methods'

class User {
	id: string
	email: string
	name: string

	constructor(id: string, email: string, name: string) {
		this.id = id
		this.email = email
		this.name = name
	}

	[Prtcl.toReadonlyClone] = defaultReadonlyClone
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

- If it is an object or array, it creates a read-only copy.

```typescript
console.log(defaultClone.call(['foo', 'bar'])) // Array ['foo', 'bar']

const obj = { foo: 'foo' }

const clone = defaultClone.call(obj)

console.log(clone) // Object { foo: 'foo' }
console.log(Object.isFrozen(clone)) // true
```

## Clone Implementations

### Clone Interface

Interface that defines how to implement the readonly clone method. See [definition](#definition).

```typescript
import type { IReadonlyClone } from 'prtcl/interfaces'

declare class ReadonlyList {
	constructor(list: string[])

	get list(): string[]
}

class List implements IReadonlyClone<ReadonlyList> {
	constructor(list: string[]) {
		// ...
	}

	get list(): string[] {
		// ...
	}

	add(item: string): void {
		// ...
	}

	remove(item: string): void {
		// ...
	}

	[Prtcl.toReadonlyClone]() {
		return new ReadonlyList(this.list)
	}
}
```

### Clone Abstract Class

Abstract Class that defines how to implement the readonly clone method.

```typescript
import { ReadonlyClonable } from 'prtcl/classes'

declare class ReadonlyList {
	constructor(list: string[])

	get list(): string[]
}

class List implements ReadonlyClonable<ReadonlyList> {
	constructor(list: string[]) {
		// ...
	}

	get list(): string[] {
		// ...
	}

	add(item: string): void {
		// ...
	}

	remove(item: string): void {
		// ...
	}

	[Prtcl.toReadonlyClone]() {
		return new ReadonlyList(this.list)
	}
}
```

### Base Class

Class with a basic implementation of the readonly clone method. Uses the [defaultClone](#default-method) internally.

```typescript
import { BaseReadonlyClonable } from 'prtcl/classes'

class User extends BaseReadonlyClonable {
	id: string
	email: string
	name: string

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
import { readonlyCloneBy } from 'prtcl/decorators'

declare class ReadonlyList {
	constructor(list: string[])

	get list(): string[]
}

@readonlyCloneBy((instance) => new ReadonlyList(instance.list))
class List {
	constructor(list: string[]) {
		// ...
	}

	get list(): string[] {
		// ...
	}

	add(item: string): void {
		// ...
	}

	remove(item: string): void {
		// ...
	}
}
```

### Method decorator

Method decorator that uses the method as the value of `Prtcl.toReadonlyClone`.

This implementation does not provide typing over the method.

```typescript
import { useToReadonlyClone } from 'prtcl/classes'

declare class ReadonlyList {
	constructor(list: string[])

	get list(): string[]
}

class List {
	constructor(list: string[]) {
		// ...
	}

	get list(): string[] {
		// ...
	}

	add(item: string): void {
		// ...
	}

	remove(item: string): void {
		// ...
	}

	@useToReadonlyClone
	customReadonlyClone() {
		return new ReadonlyList(this.list)
	}
}
```
