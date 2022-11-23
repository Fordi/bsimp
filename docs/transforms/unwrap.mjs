import { isExpression, isNot } from '../tools.mjs';

// unwrap non-unary ops with one argument.  Do this recursively.
// (u exp) => exp
// (n exp) => exp
const unwrap = (exp) => {
  if (!isExpression(exp)) return exp;
  if (!isNot(exp) && exp.length === 2) return exp[1];
  return [exp[0], ...exp.slice(1).map(unwrap)];
};

export default unwrap;