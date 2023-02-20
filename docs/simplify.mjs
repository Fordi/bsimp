import { areEqual, isExpression, isSymbol, sortExpr, term } from './tools.mjs';
import toString, { LOGIC, POLISH, SET, SOURCE, CODE } from "./toString.mjs";
import transforms from './transforms/index.mjs';
export * from './consts.mjs';
export * from './tools.mjs';

export { term, toString, LOGIC, POLISH, SET, SOURCE, CODE };

// Turn on for debugging...
let LOG = false;
let depth = 0;

const simplifySubexpressions = (exp, steps) => {
  // Non-expressions do not have subexpressions
  if (!isExpression(exp)) return exp;
  // Indent output by 1 so the developer has some sense of how deep the subexpression is
  depth += 1;
  // Our expressions are of the form [operation, ...operands] - a kind
  //  of simple polish notation that matches really well with arrays.
  //  So, what this line does is replace [operation, ...operands] with
  //  [operation, ...simplifiedOperands]
  const r = [exp[0], ...exp.slice(1).map(se => simplify(se, steps, exp[0]))];
  depth -= 1;
  return r;
};

// Hackery.  `Array(n + 1).join(str)` will repeat `str` `n` times
const indent = () => new Array(depth + 1).join('  ');

const pass = (exp, p, steps) => {
  // Symbols cannot be further simplified
  if (isSymbol(exp)) return exp;
  // Normalize the expression by simplifying its children and ordering it consistently.
  exp = sortExpr(simplifySubexpressions(exp, steps));
  // Loop through the transforms
  const names = Object.keys(transforms);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    // Try applying the transform
    const r = transforms[name](exp, p);
    // When we find one that does something
    if (!areEqual(exp, r, false)) {
      steps && steps.push([name, p, exp, r]);
      // Log the change if asked to
      if (LOG) {
        console.log(p);
        console.log(`${indent()}${name}${p ? `(${toString(p)})` : ''}: ${toString(exp)} -> ${toString(r)}`);
      }
      // Normalize and order it, and return the result, so the outer simplifier
      //  can start again.
      return sortExpr(simplifySubexpressions(r, steps));
    }
  }
  return exp;
};

export const simplify = (exp, steps, p = null) => {
  // Symbols cannot be simplified
  if (isSymbol(exp)) return exp;
  let next;
  // Keep going until a pass does not change the expression
  while (!areEqual(next, exp)) {
    exp = next ?? exp;
    next = pass(exp, p, steps);
  }
  // return the final simplification.
  return next;
};

simplify.log = v => {
  LOG = v;
};