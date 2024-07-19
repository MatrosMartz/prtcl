# Equals

<!--toc:start-->

- [Equals](#equals)
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

Method used to check whether one object is equal to another.

Its symbol is located inside the Prtcl object:

## Overview

### Symbol

```typescript
import { Prtcl } from "prtcl";

Prtcl.equalsTo;
```

### Definition

This interface defines how to implement the method:

```typescript
interface IEquals {
  [Prtcl.equalsTo](other: unknown): boolean;
}
```

### Guard

You can check if an object implements it in the following way:

```typescript
if (Prtcl.impl("equals", obj)) {
  // obj implements equals method
}
```

### Type Assertion

You can add a method to a type using this type assertion:

```typescript
import { Extend } from "prtcl";

declare const foo: number[];

foo as Extend.Equals<number[]>; // number[] & { [Prtcl.equalsTo](other: unknown): boolean }
```

### Default Method

Basic Method for compare an object with other, not recommended for direct use.

```typescript
// Definition
export function defaultEquals(this: object, other: unknown): boolean {
  if (typeof other !== "object" || other == null) return false;

  const thisKeys = Object.keys(this);
  if (thisKeys.length !== Object.keys(other).length) return false;
  const stack: Array<readonly [unknown, unknown]> = thisKeys.map((
    key,
  ) => [Reflect.get(this, key), Reflect.get(other, key)]);

  while (stack.length > 0) {
    const [val1, val2] = stack.shift()!;

    if (Number.isNaN(val1) && Number.isNaN(val2)) continue;

    if (typeof val1 === "object" && val1 != null) {
      if (typeof val2 !== "object" || val2 == null) return false;

      const val1Keys = Object.keys(val1);

      if (val1Keys.length !== Object.keys(val2).length) return false;

      stack.push(
        ...val1Keys.map<[unknown, unknown]>((
          key,
        ) => [Reflect.get(val1, key), Reflect.get(val2, key)]),
      );
    }
    if (val1 !== val2) return false;
  }
  return true;
}

// Use
import { defaultEquals } from "prtcl/methods";

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  [Prtcl.equalsTo] = defaultEquals;
}
```

## Implementations

### Interface

Interface that defines how to implement the equals method.

```typescript
import type { IEquals } from "prtcl/interfaces";

class Position implements IEquals {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  [Prtcl.equalsTo](other: unknown) {
    if (!(other instanceof Position)) return false;
    return this.x === other.x && this.y === other.y;
  }
}
```

### Abstract Class

Abstract Class that defines how to implement the equals method.

```typescript
import type { Equatable } from "prtcl/classes";

class Position extends Equatable {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  [Prtcl.equalsTo](other: unknown) {
    if (!(other instanceof Position)) return false;
    return this.x === other.x && this.y === other.y;
  }
}
```

### Base class

A class with a basic implementation of the compare method. Uses the
[defaultCompare](#default-method) internally.

```typescript
import type { BaseEquatable } from "prtcl/classes";

class Position extends BaseEquatable {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
```

### Class Decorator

Class decorator that receives a function to define how to compare the object.

```typescript
import type { equalsBy } from "prtcl/decorators";

@equalsBy((instance, other) => {
  if (!(other instanceof Position)) return false;
  return instance.x === other.x && instance.y === other.y;
})
class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
```

### Method decorator

Method decorator that uses the method as the value of `Prtcl.compareTo`.

This implementation does not provide typing over the method.

```typescript
import type { useEqualsTo } from "prtcl/decorators";

class Position extends BaseEquatable {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  @useEqualsTo
  customEquals(other: unknown) {
    if (!(other instanceof Position)) return false;
    return this.x === other.x && this.y && other.y;
  }
}
```
