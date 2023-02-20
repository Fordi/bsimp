# bsimp

A boolean expression simplifier

[Demo](https://fordi.github.io/bsimp)

## parse(string)

Convert a string representation of a logical expression into an expression object

```javascript
import { parse } from '@fordi-org/bsimp/parse';

console.log(parse('A+A!B'));
```

> ```
> [
>   Symbol( ∪ ),
>   Symbol(A),
>   [ Symbol( ∩ ), Symbol(A), [ Symbol(!), Symbol(B) ] ]
> ]
> ```

## toString(expression)

Convert an expression object into a string

```javascript
import { parse, toString, SET } from '@fordi-org/bsimp';

console.log(toString(parse('A+A!B'), SET));
console.log(toString(parse('A+A!B'), LOGIC));
console.log(toString(parse('A+A!B'), POLISH));
console.log(toString(parse('A+A!B'), SOURCE));
```

> ```
> A ∪ (A ∖ B)
> A+A!B
> (∪ A (∩ A !B))
> [OR, A, [AND, A, [NOT, B]]]
> ```

## simplify(expression, \[steps\])

Simplify a symbolized boolean expression.  Optionally, pass an array to collect steps.

```javascript
import { simplify, parse, toString, LOGIC } from '@fordi-org/bsimp/simplify';

const toSimplify = [
  'A+B!C+C!A',
  'AB!C+ABC+A!B!C+B!A!C',
];

const result = toSimplify.map(expStr => {
  const exp = parse(expStr);
  const steps = [];
  const simple = simplify(exp, steps);
  return {
    simplified: toString(simple, LOGIC),
    steps,
  };
});

console.log(result);
```

> ```
> [ 
>   {
>     simplified: 'A+B+C',
>     steps: [
>       [
>         'absorption',
>         null,
>         [OR, A, [AND, B, [NOT, C]], [AND, C, [NOT, A]]],
>         [OR, A, C, B]
>       ]
>     ]
>   },
>   {
>     simplified: 'AB+A!C+B!C',
>     steps: [...],
>   }
> ]
> ```

The structure of a step is a tuple of [`transform`, `parentOperation`, `fromExpr`, `toExpr`].

## symbolize(termStr)

Convert a string into a symbol.  For AND, OR, NOT, TRUE, and FALSE, this will convert the string to the internal symbol.  For any other string, you'll get `term(termStr)`.

## term(termStr)

Convert a string into a symbol.  For any previously named term, you'll get the same symbol back for the same input string (this differs from how `Symbol(termStr)` works, in that every Symbol that is created is unique).

-----

## Expression Objects

Formally...

* Expression: [Operator, ...Operand]
* Operator: AND | OR | NOT
* Operand: TRUE | FALSE | Symbol | Expression

That is, it's an array where the first element must be an Operator, and all the following symbols must be Operands.  Operators are the symbols `AND`, `OR`, and `NOT` (exported from `@fordi-org/bsimp`).  Operands can be the symbols `TRUE` or `FALSE`, another Expression, or any user-defined Symbol.

## Expression strings

The grammar is very forgiving, and allows the use of the following:

### Polish notation

`{OP} {TERM} {TERM}*`

e.g.,

`"(and A B C)"` becomes `[AND, A, B, C]`

### Infix notation

`{TERM} ({OP} {TERM})*`

e.g.,

`(P | Q | R)` becomes `[OR, P, Q, R]`

### Ternary

The parser understands Ternary expressions, and the `CODE` stringifier knows how to convert expressions to them, however, they are expressed as a logical combination of `AND`, `OR`, and `NOT`.  A ternary, if you're unaware, is like an if / then / else statment, where each piece is a term.

So, `C ? T : F` evaluates to `[OR, [AND, C, T], [AND, [NOT, C], F]]`.  You can nest ternaries, but they must be grouped to avoid ambiguity.

Support for ternaries is meant to be an assist in passing expressions into the simplifier - while the `CODE` stringifier can identify and subsume the simple form of this pattern, nested ternaries will usually be simplified into something the `CODE` stringifier cannot identify (for example, `a ? (b ? c : d) : e` will become `(a && b && c) || (e && !a) || (a && !b && d)`, which is not ideal).

I may work more on this, but ternary support was initially meant to be for input.

### Implicit AND

`{TERM}{TERM}*`

e.g.,

`XYZ` becomes `[AND, X, Y, Z]`

Note: because of the need for implicit AND,
the parser limits terms to single-letter, case-sensitive.  The simplifier is not so-limited, and you can do something like this:

```javascript
const [a, b] = [
  term('longName'),
  term('longerName'),
];
const simple = simplify([OR, a, [AND, a, [NOT, b]]]);
```

The two use cases I had in mind were a boolean simplifier for linters (where the linter could choose completely random symbol names), and an on-page logic simplifier widget (where a user can enter tight logic strings and get back their simplification).

-----

## Development concerns

To run the test suite:

```
npm run test
```

To compile the boolean grammar:

```
npm run build:peg
```

To build the whole thing:

```
npm run build
```

