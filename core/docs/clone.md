# Clone

<!--toc:start-->

## Table of Contents

- [Clone](#clone)
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

The Clone method is used to obtain a copy of an object.

It receives as a single argument the cloning mode hint, which can have the
following values: _shallow_, _deep_, or _default_.

## Overview

### Symbol

The Clone symbol is located inside the Prtcl object:

```typescript
import { Prtcl } from "prtcl";

Prtcl.toClone;
```

### Definition

This interface defines how to implement the method:

```typescript
interface IClone<T> {
  [Prtcl.toClone](hint: "default" | "deep" | "shallow"): T;
}
```

### Guard

To check if an object implements it:

```typescript
if (Prtcl.impl("clone", obj)) {
  // obj implements clone method
}
```

### Type Assertion

To overwrite the type use the following type assertion:

```typescript
import { Extend } from "prtcl";

declare const foo: Foo;

foo as Extend.Clone<Foo>; // Foo & { [Prtcl.toClone](hint): Foo }
```

### Default method

Basic method to clone an object, not recommended for direct use.

```typescript
// Definition
export function defaultClone<T extends object>(this: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
}

// Use
import { defaultClone } from "prtcl/methods";

class Foo<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  [Prtcl.toClone] = defaultClone;
}
```

## Implementations

### Interface

The interface that defines how to implement the clone method. See
[definition](#definition).

```typescript
import type { IClone } from "prtcl/interfaces";

class Foo<T> implements IClone<Foo<T>> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  [Prtcl.toClone](): Foo<T> {
    return new Foo(this.value);
  }
}
```

### Abstract Class

Abstract class that defines how to implement the clone method.

```typescript
import { Clonable } from "prtcl/classes";

class Foo<T> extends Clonable<Foo<T>> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  [Prtcl.toClone](): Foo<T> {
    return new Foo(this.value);
  }
}
```

### Base Class

Class with a basic implementation of the clone method. Uses the
[defaultClone](#default-method) internally.

```typescript
import { BaseClonable } from "prtcl/classes";

class Foo<T> extends BaseClonable {
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}
```

### Class Decorator

Class decorator that receives a function to define how to clone the object.

This implementation does not provide typing over the method.

```typescript
import { cloneBy } from "prtcl/decorators";

@cloneBy((instance) => new Foo(instance.value))
class Foo<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}
```

### Method decorator

Method decorator that uses the method as the value of `Prtcl.toClone`.

This implementation does not provide typing over the method.

```typescript
import { useToClone } from "prtcl/decorators";

class Foo<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  @useToClone
  customClone() {
    return new Foo(this.value);
  }
}
```
