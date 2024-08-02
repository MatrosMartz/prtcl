# Compare

<!--toc:start-->

## Table of Contents

- [Compare](#compare)
  - [Overview](#overview)
    - [Symbol](#symbol)
    - [Definition](#definition)
    - [Guard](#guard)
    - [Type Assertion](#type-assertion)
    - [Default Method](#default-method)
  - [Implementations](#implementations)
    - [Interface](#interface)
    - [Abstract Class](#abstract-class)
    - [Base class](#base-class)
    - [Class Decorator](#class-decorator)
    - [Method decorator](#method-decorator)

<!--toc:end-->

Method used to compare the object with another object and returns the difference as a numerical value.

Should throw an error if it cannot be compared to the other object.

## Overview

### Symbol

Its symbol is located inside the Prtcl object:

```typescript
import { Prtcl } from 'prtcl'

Prtcl.compareTo
```

### Definition

This interface defines how to implement the method:

```typescript
interface ICompare<Other> {
	[Prtcl.compareTo](other: Other): number
}
```

### Guard

You can check if an object implements it in the following way:

```typescript
if (Prtcl.impl('compare', obj)) {
	// obj implements compare method
}
```

You can add a method to a type using this type assertion:

### Type Assertion

```typescript
import { Extend } from 'prtcl'

declare const foo: Foo

foo as Extend.Compare<Foo, unknown> // Foo & { [Prtcl.compareTo](other: unknown): number }
```

### Default Method

Basic Method for compare an object with other, not recommended for direct use.

```typescript
// Definition
export function defaultCompare(
	this: T,
	other: unknown,
): number {
	return Number(this) - Number(other)
}

// Use
import { defaultCompare } from 'prtcl/methods'

class Position {
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	valueOf() {
		return this.x + this.y
	}

	[Prtcl.compareTo] = defaultCompare
}
```

transforms one's own object and another into numbers for comparison.

## Implementations

### Interface

Interface that defines how to implement the compare method. See [definition](#definition).

```typescript
import type { ICompare } from 'prtcl/interfaces'

class Position implements ICompare<Position> {
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	[Prtcl.compareTo](other: Position): number {
		if (!(other instanceof Position)) {
			throw new Error('Other not is a Position')
		}
		return (this.x + this.y) - (other.x + other.y)
	}
}
```

### Abstract Class

Abstract Class that defines how to implement the compare method.

```typescript
import { Comparable } from 'prtcl/classes'

class Position extends Comparable<Position> {
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	[Prtcl.compareTo](other: Position): number {
		if (!(other instanceof Position)) {
			throw new Error('Other not is a Position')
		}
		return (this.x + this.y) - (other.x + other.y)
	}
}
```

### Base class

A class with a basic implementation of the compare method. Uses the [defaultCompare](#default-method) internally.

```typescript
import { BaseComparable } from 'prtcl/classes'

class Position extends BaseComparable {
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}
}
```

### Class Decorator

Class decorator that receives a function to define how to compare the object.

```typescript
import { compareBy } from 'prtcl/decorators'

@compareBy((instance, other) => {
	if (!(other instanceof Position)) throw new Error('Other not is a Position')
	return (instance.x + instance.y) - (other.x + other.y)
})
class Position {
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}
}
```

### Method decorator

Method decorator that uses the method as the value of `Prtcl.compareTo`.

This implementation does not provide typing over the method.

```typescript
import { useCompareTo } from 'prtcl/decorators'

class Position {
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	@useCompareTo
	customCompare(other: unknown) {
		if (!(other instanceof Position)) {
			throw new Error('Other not is a Position')
		}
		return (this.x + this.y) - (other.x + other.y)
	}
}
```
