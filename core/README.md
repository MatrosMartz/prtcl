# Prtcl/Prtcl

Prtcl derives from the abbreviation of the word protocol, very subtly inspired
by the tc39 proposal
[First-Class Protocols](https://github.com/tc39/proposal-first-class-protocols).
This module is the core of the Prtcl library, and export various symbols to use
as keys to define internal methods.

It is intended to be implemented by other members of the Prtcl library; however,
if the rest of the library does not suit your tastes, you are welcome to create
your own implementation of these methods.

## Quick Start

<details>
<summary> Deno </summary>

```bash
deno add @prtcl/prtcl
```

</details>

## Methods

Prtcl currently works with six methods, but plans are underway to add more in
the future. This includes:

- [Clone](./docs/clone.md) - Method that returns a copy of the object.
- [Compare](./docs/compare.md) - Method that compares the object with another
  object, and returns the difference in a numerical value.
- [Equals](./docs/equals.md) - Method that checks whether one object is equal to
  another.
- [Flat](./docs/flat.md) - Method that unwraps an object into its primitive
  values or into a flat object.
- [Mutable Clone](./docs/mutable-clone.md) - Method that returns a mutable copy
  of the object.
- [Readonly Clone](./docs/readonly-clone.md) - Method that returns a readonly
  copy of the object.

## Use

If possible use a function to abstract your implementation, instead of using the
methods directly.

```typescript
// Bad
const fooCopy = foo[Prtcl.toClone]();

// Good
const Copy = {
  clone(obj: unknown) {
    // Calls Prtcl.toClone
  },
};

const fooCopy = Copy.clone(foo);
```

## Default Methods

Default methods to implement the various methods of Prtcl. Used in
[Base Classes](#base-classes). Not recommended for direct use.

- [Clone Default Method](./docs/clone.md#default-method)
- [Compare Default Method](./docs/compare.md#default-method)
- [Equals Default Method](./docs/equals.md#default-method)
- [Mutable Clone Default Method](./docs/mutable-clone.md#clone-default-method)
- [Readonly Clone Default Method](./docs/readonly-clone.md#clone-default-method)
- [Flat Default Method](./docs/flat.md#default-method)

## implementations

You can simply use the symbols, to define the methods, however, this module
offers several ways to implement them:

- [Interfaces](#interfaces)
- [Abstract Classes](#abstract-classes)
- [Base Classes](#base-classes)
- [Class Decorators](#class-decorators) - Recommended in cases where you are
  working with classes and you don't want to use the symbols directly (or you
  like decorators).
- [Method Decorators](#method-decorators) - Recommended in classes where you
  implement your own methods and want to migrate to using Prctl.

### Interfaces

They define how to implement the methods, and lack a default implementation.

Useful in most cases, however if you work with classes you may be interested to
see other implementations.

- [Clone Interface](./docs/clone.md#interface)
- [Compare Interface](./docs/compare.md#interface)
- [Equals Interface](./docs/equals.md#interface)
- [Flat Interface](./docs/flat.md#interface)
- [Mutable Clone Interface](./docs/mutable-clone.md#interface)
- [Readonly Clone Interface](./docs/readonly-clone.md#interface)

### Abstract Classes

Abstract classes to define how to implement the various methods of Prtcl, and
lack default implementation.

- [Clone Abstract Class](./docs/clone.md#abstract-class)
- [Compare Abstract Class](./docs/compare.md#abstract-class)
- [Equals Abstract Class](./docs/equals.md#abstract-class)
- [Flat Abstract Class](./docs/flat.md#abstract-class)
- [Mutable Clone Abstract Class](./docs/mutable-clone.md#abstract-class)
- [Readonly Clone Abstract Class](./docs/readonly-clone.md#abstract-class)

### Base Classes

Base classes that use the default methods internally. Not recommend using it
because of its limited implementation.

- [Clone Base Class](./docs/clone.md#base-class)
- [Compare Base Class](./docs/compare.md#base-class)
- [Equals Base Class](./docs/equals.md#base-class)
- [Flat Base Class](./docs/flat.md#base-class)
- [Mutable Clone Base Class](./docs/mutable-clone.md#base-class)
- [Readonly Clone Base Class](./docs/readonly-clone.md#base-class)

### Class Decorators

Class decorators that use the functions passed as values for the implementation
of the methods. The first parameter received by the function passed to it is the
instance of the class.

Note that this implementation does not provide any typing to know that the class
implements the methods. class-decorator

- [Clone Class Decorator](./docs/clone.md#class-decorator)
- [Compare Class Decorator](./docs/compare.md#class-decorator)
- [Equals Class Decorator](./docs/equals.md#class-decorator)
- [Flat Class Decorator](./docs/flat.md#class-decorator)
- [Mutable Clone Class Decorator](./docs/mutable-clone.md#class-decorator)
- [Readonly Clone Class Decorator](./docs/readonly-clone.md#class-decorator)

### Method Decorators

Method decorators to use the method as the value of the prtcl method.

If your application already uses its own methods that perform the same function
as these, you could use this implementation to migrate.

Note that this implementation does not provide any typing to know that the class
implements the methods.

- [Clone Method Decorator](./docs/clone.md#method-decorator)
- [Compare Method Decorator](./docs/compare.md#method-decorator)
- [Equals Method Decorator](./docs/equals.md#method-decorator)
- [Flat Method Decorator](./docs/flat.md#method-decorator)
- [Mutable Clone Method Decorator](./docs/mutable-clone.md#method-decorator)
- [Readonly Clone Method Decorator](./docs/readonly-clone.md#method-decorator)
