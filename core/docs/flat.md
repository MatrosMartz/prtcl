# Flat

<!--toc:start-->

## Table of Contents

- [Flat](#flat)
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

This method is similar to the `toJSON` method, which some native objects
implement. However `toJSON` does not seem to be intended as a standard for data
serialization, and the javascript committee prefers that users implement their
own methods to achieve this.

Well, you could use this method to standardise the serialisation of your objects
in your application _wink wink_.

## Overview

### Symbol

Its symbol is located inside the Prtcl object:

```typescript
import { Prtcl } from "prtcl";

Prtcl.toFlat;
```

### Definition

This interface defines how to implement the method:

```typescript
interface IFlat<Data extends FlatData> {
  [Prtcl.toFlat](): Data;
}
```

### Guard

You can check if an object implements it in the following way:

```typescript
if (Prtcl.impl("flat", obj)) {
  // obj implements flat method
}
```

### Type Assertion

You can add a method to a type using this type assertion:

```typescript
import { Extend } from "prtcl";

declare const foo: Set<number>;

foo as Extend.Flat<Set<number>, number[]>; // Set<number> & { [Prtcl.toFlat](): number[] }
```

### Default method

Basic method to flat an object, not recommended for direct use.

```typescript
// Definition
import type { FlatData } from "prtcl/types";

export function defaultFlat<T>(this: T): FlatData {
  return JSON.parse(JSON.stringify(this));
}

// use
import { defaultFlat } from "prtcl/methods";

class Notes {
  notes: string[] = [];

  add(note: string) {
    notes.push(note);
  }

  remove(note: string) {
    notes = notes.filter((n) => note === n);
  }

  [Prtcl.toFlat] = defaultFlat;
}
```

## Implementations

### Interface

Interface that defines how to implement the flat method. See
[definition](#definition).

```typescript
import type { IFlat } from "prtcl/interfaces";

type NotesData = string[];

class Notes implements IFlat<string[]> {
  notes: string[] = [];

  add(note: string) {
    notes.push(note);
  }

  remove(note: string) {
    notes = notes.filter((n) => note === n);
  }

  [Prtcl.toFlat]() {
    return this.notes;
  }
}
```

### Abstract Class

Abstract Class that defines how to implement the flat method.

```typescript
import type { Flateable } from "prtcl/classes";

class Notes implements Flateable<string[]> {
  notes: string[] = [];

  add(note: string) {
    notes.push(note);
  }

  remove(note: string) {
    notes = notes.filter((n) => note === n);
  }

  [Prtcl.toFlat]() {
    return this.notes;
  }
}
```

### Base Class

Class with a basic implementation of the flat method. Uses the
[defaultFlat](#default-method) internally.

```typescript
import { BaseFlateable } from "prtcl/classes";

class Notes implements BaseFlateable {
  notes: string[] = [];

  add(note: string) {
    notes.push(note);
  }

  remove(note: string) {
    notes = notes.filter((n) => note === n);
  }
}
```

### Class Decorator

Class decorator that receives a function to define how to flat the object.

This implementation does not provide typing over the method.

```typescript
import { flatBy } from "prtcl/decorators";

@flatBy((instance) => instance.notes)
class Notes {
  notes: string[] = [];

  add(note: string) {
    notes.push(note);
  }

  remove(note: string) {
    notes = notes.filter((n) => note === n);
  }
}
```

### Method decorator

Method decorator that uses the method as the value of `Prtcl.toFlat`.

This implementation does not provide typing over the method.

```typescript
import { useToFlat } from "prtcl/decorators";

class Notes {
  notes: string[] = [];

  add(note: string) {
    notes.push(note);
  }

  remove(note: string) {
    notes = notes.filter((n) => note === n);
  }

  @useToFlat
  customFlat() {
    return this.notes;
  }
}
```
