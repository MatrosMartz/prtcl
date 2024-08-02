# Prtcl/Prtcl

<!--toc:start-->

## Table of Contents

- [Prtcl/Prtcl](#prtclprtcl)
  - [Quick Start](#quick-start)
  - [Use](#use)
  - [Prtcl object](#prtcl-object)
    - [Methods](#methods)
    - [Guard function](#guard-function)
  - [Type Assertion](#type-assertion)
  - [Default Methods](#default-methods)
  - [implementations](#implementations)
    - [Interfaces](#interfaces)
    - [Abstract Classes](#abstract-classes)
    - [Base Classes](#base-classes)
    - [Class Decorators](#class-decorators)
    - [Method Decorators](#method-decorators)
  - [Feedback](#feedback)
  - [Contributing](#contributing)
  - [Requirements](#requirements)
  - [Integrations](#integrations)
  - [TODO](#todo)

<!--toc:end-->

Prtcl derives from the abbreviation of the word protocol, very subtly inspired by the tc39 proposal
[First-Class Protocols](https://github.com/tc39/proposal-first-class-protocols). This module is the core of the Prtcl
library, and export various symbols to use as keys to define internal methods.

It is intended to be implemented by other members of the Prtcl library; however, if the rest of the library does not
suit your tastes, you are welcome to create your own implementation of these methods.

## Quick Start

<details>
<summary> Deno </summary>

```bash
deno add @prtcl/prtcl
```

</details>

## Use

If possible use a function to abstract your implementation, instead of using the methods directly.

```typescript
// Bad
const fooCopy = foo[Prtcl.toClone]()

// Good
const Copy = {
	clone(obj: unknown) {
		// Calls Prtcl.toClone
	},
}

const fooCopy = Copy.clone(foo)
```

## Prtcl object

It contains the symbols of the methods, together with the `impl` function which serves as a guard for the implementation
of the methods.

### Methods

Prtcl currently works with six methods, but plans are underway to add more in the future. This includes:

- [Clone](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/clone.md) - Method that returns a copy of
  the object.
- [Compare](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/compare.md) - Method that compares the
  object with another object, and returns the difference in a numerical value.
- [Equals](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/equals.md) - Method that checks whether
  one object is equal to another.
- [Flat](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/flat.md) - Method that unwraps an object
  into its primitive values or into a flat object.
- [Mutable Clone](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/mutable-clone.md) - Method that
  returns a mutable copy of the object.
- [Readonly Clone](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/readonly-clone.md) - Method that
  returns a readonly copy of the object.

### Guard function

The `impl` function works as a guard on the implementation of the methods, ensuring that the object uses the method
symbol and its value is a function.

As first parameter it receives the method to check if it exists in the object, and in the second one the object as such.
Returning true if the object complies with the interface of the method, false otherwise.

Example with the clone method:

```typescript
import { Prtcl } from 'prtcl'

if (Prtcl.impl('clone', obj)) {
	// `obj` uses the Prtcl.toClone key and its value is a function.
}
```

## Type Assertion

Contains types of each method for type assertion, which receive a type and return the intercept between the type and the
method interface.

Example with the clone method:

```typescript
import type { Extend } from 'prtcl'

const obj = {}

obj as Extend.Clone<typeof obj> // (typeof obj) & { [Prtcl.toClone](): tyepof obj }
```

## Default Methods

Default methods to implement the various methods of Prtcl. Used in [Base Classes](#base-classes). Not recommended for
direct use.

- [Clone Default Method](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/clone.md#default-method)
- [Compare Default Method](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/compare.md#default-method)
- [Equals Default Method](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/equals.md#default-method)
- [Mutable Clone Default Method](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/mutable-clone.md#clone-default-method)
- [Readonly Clone Default Method](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/readonly-clone.md#clone-default-method)
- [Flat Default Method](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/flat.md#default-method)

## implementations

You can simply use the symbols, to define the methods, however, this module offers several ways to implement them:

### Interfaces

They define how to implement the methods, and lack a default implementation.

Useful in most cases, however if you work with classes you may be interested to see other implementations.

- [Clone Interface](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/clone.md#interface)
- [Compare Interface](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/compare.md#interface)
- [Equals Interface](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/equals.md#interface)
- [Flat Interface](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/flat.md#interface)
- [Mutable Clone Interface](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/mutable-clone.md#interface)
- [Readonly Clone Interface](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/readonly-clone.md#interface)

### Abstract Classes

Abstract classes to define how to implement the various methods of Prtcl, and lack default implementation.

- [Clone Abstract Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/clone.md#abstract-class)
- [Compare Abstract Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/compare.md#abstract-class)
- [Equals Abstract Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/equals.md#abstract-class)
- [Flat Abstract Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/flat.md#abstract-class)
- [Mutable Clone Abstract Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/mutable-clone.md#abstract-class)
- [Readonly Clone Abstract Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/readonly-clone.md#abstract-class)

### Base Classes

Base classes that use the default methods internally. Not recommend using it because of its limited implementation.

- [Clone Base Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/clone.md#base-class)
- [Compare Base Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/compare.md#base-class)
- [Equals Base Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/equals.md#base-class)
- [Flat Base Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/flat.md#base-class)
- [Mutable Clone Base Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/mutable-clone.md#base-class)
- [Readonly Clone Base Class](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/readonly-clone.md#base-class)

### Class Decorators

Class decorators that use the functions passed as values for the implementation of the methods. The first parameter
received by the function passed to it is the instance of the class.

Note that this implementation does not provide any typing to know that the class implements the methods. class-decorator

- [Clone Class Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/clone.md#class-decorator)
- [Compare Class Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/compare.md#class-decorator)
- [Equals Class Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/equals.md#class-decorator)
- [Flat Class Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/flat.md#class-decorator)
- [Mutable Clone Class Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/mutable-clone.md#class-decorator)
- [Readonly Clone Class Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/readonly-clone.md#class-decorator)

### Method Decorators

Method decorators to use the method as the value of the prtcl method.

If your application already uses its own methods that perform the same function as these, you could use this
implementation to migrate.

Note that this implementation does not provide any typing to know that the class implements the methods.

- [Clone Method Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/clone.md#method-decorator)
- [Compare Method Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/compare.md#method-decorator)
- [Equals Method Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/equals.md#method-decorator)
- [Flat Method Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/flat.md#method-decorator)
- [Mutable Clone Method Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/mutable-clone.md#method-decorator)
- [Readonly Clone Method Decorator](https://github.com/MatrosMartz/prtcl/blob/main/packages/prtcl/docs/readonly-clone.md#method-decorator)

## Feedback

We welcome any feedback you may have! Please feel free to open an issue on our
[GitHub repository](https://github.com/MatrosMartz/prtcl/issues) with your suggestions, questions, or any issues you
encounter.

## Contributing

Thank you for considering contributing to Prtcl! Here are some guidelines to help you get started:

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Create a new branch for your feature or bugfix.
4. Make your changes in the new branch.
5. Ensure your code passes all tests and adheres to the style guide.
6. Commit your changes with a clear and concise message.
7. Push your changes to your forked repository.
8. Create a pull request from your forked repository's branch to the main repository's main branch.

## Requirements

- This project is built using [Deno](https://deno.land). Make sure you have it installed.
- Follow the existing code style and conventions.
- Write tests for your changes.

## Integrations

This section will cover the various integrations of the Prtcl library with other libraries and frameworks. Stay tuned
for updates!

## TODO

- [ ] Create web documentation.
- [ ] Create the rest of the library and place them in integrations.
- [x] Add an optional parameter in the methods clone, mutableClone, and readonlyClone to specify whether the copy should
      be deep or shallow.
