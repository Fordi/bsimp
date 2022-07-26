# bsimp

A boolean expression simplifier

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

## simplify(expression)

Simplify a symbolized boolean expression.

```javascript
import { simplify, parse, toString, LOGIC } from '@fordi-org/bsimp/simplify';

const toSimplify = [
  'A+B!C+C!A',
  'AB!C+ABC+A!B!C+B!A!C',
];
const result = toSimplify.map(expStr => {
  const exp = parse(expStr);
  const simple = simplify(exp);
  return toString(simple, LOGIC);
});

console.log(result);
```

> ```
> [ 'A+B+C', 'AB+A!C+B!C' ]
> ```

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

```bash
npm run test
```

To compile the boolean grammar:

```bash
npm run build:peg
```

To build the whole thing:

```
npm run build
```

