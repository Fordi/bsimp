import { areEqual, isNot, isSymbol } from "../tools.mjs";

// https://en.wikipedia.org/wiki/Boolean_algebra#Monotone_laws (idempotence)
// Eliminate duplicates within expressions.
//  (o P P ...) => (o P ...)
const tautology = (exp) => {
  if (isNot(exp) || isSymbol(exp)) return exp;
  const dupes = new Set();
  for (let p = 1; p < exp.length - 1; p++) {
    for (let q = p + 1; q < exp.length; q++) {
      if (areEqual(exp[p], exp[q])) {
        dupes.add(q);
      }
    }
  }
  if (dupes.size) {
    return exp.filter((_, i) => !dupes.has(i));
  }
  return exp;
};

export default tautology;