import { FALSE, TRUE } from '../consts.mjs';
import {
  isExpression,
  isNot,
  isAnd,
  isOr,
  contains,
  without,
} from '../tools.mjs';

// https://en.wikipedia.org/wiki/Boolean_algebra#Monotone_laws (annihilators)
// (∩ FALSE ...) => FALSE
// (∩ TRUE ...) => (∩ ...)
// (∪ TRUE ...) => TRUE
// (∪ FALSE ...) => (∪ ...)
const identity = (exp) => {
  if (!isExpression(exp) || isNot(exp)) return exp;
  const hasFalse = contains(exp, FALSE);
  const hasTrue = contains(exp, TRUE);
  if (isAnd(exp)) {
    if (hasFalse) return FALSE;
    if (hasTrue) return without(exp, TRUE);
  }
  if (isOr(exp)) {
    if (hasTrue) return TRUE;
    if (hasFalse) return without(exp, FALSE);
  }
  return exp;
};

export default identity;
