import { FALSE, TRUE } from "../consts.mjs";
import { hasComplement, isAnd, isNot, isSymbol } from "../tools.mjs";

// https://en.wikipedia.org/wiki/Boolean_algebra#Nonmonotone_laws (complementation)
// (∪ P !P ...) => TRUE
// (∩ P !P ...) => FALSE
const complement = (exp) => {
  if (isNot(exp) || isSymbol(exp) || !hasComplement(exp)) return exp;
  if (isAnd(exp)) return FALSE;
  return TRUE;
};

export default complement;
