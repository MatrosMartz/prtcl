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

An important difference is that this method, unlike `toJSON`, this method can
return symbols and bigints, primitives not supported in JSON files.

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

This method follows the following steps:

- If it is a primitive, it returns it as is.

```typescript
console.log(defaultFlat.call("foo")); // Throws

const obj = { foo: "foo" };

console.log(defaultFlat.call(obj)); // Object { foo: 'foo' }
```

- If it is a function, it returns undefined.

```typescript
console.log(defaultFlat.call(() => {})); // undefined

const obj = { foo: () => {} };

console.log(defaultFlat.call(obj)); // Object { }
```

- If the object extends wrapper classes (e.g. Number, String), it returns its
  primitive value.

```typescript
console.log(defaultFlat.call(new String("foo"))); // 'foo'

const obj = { foo: new String("foo") };

console.log(defaultFlat.call(obj)); // Object { foo: 'foo' }
```

- If the object has the `toJSON` method, it returns its result.

```typescript
console.log(defaultFlat.call(new Date("2024-07-31"))); // '2024-07-31T00:32:00.000Z'

const obj = { date: new Date("2024-07-31") };

console.log(defaultFlat.call(obj)); // Object { date: '2024-07-31T00:32:00.000Z' }
```

- If the object is iterable, it transforms it into an array (e.g. Maps and
  Sets).

```typescript
console.log(defaultFlat.call(new Map([["foo", 1], ["bar", 2]]))); // Array [['foo', 1], ['bar', 2]]

const obj = { list: new Set(["foo", "bar"]) };

console.log(defaultFlat.call(obj)); // Object { list: Array ['foo', 'bar'] }
```

- In any other case, it returns a flat object.

```typescript
class Foo<T> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }
}

console.log(defaultFlat.call(new Foo("foo"))); // Object { value: 'foo' }

const obj = { foo: new Foo("foo") };

console.log(defaultFlat.call(obj)); // Object { foo: Object { value: 'foo' } }
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
