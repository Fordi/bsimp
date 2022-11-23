import { isNot, isSymbol } from "../tools.mjs";

// https://en.wikipedia.org/wiki/Boolean_algebra#Monotone_laws
// (∪ (∪ P Q) R) => (∪ P Q R)
// (∩ (∩ P Q) R) => (∩ P Q R)
const association = (exp) => {
  if (isNot(exp) || isSymbol(exp)) return exp;
  const [op, ...exprs] = exp;
  const res = [op];
  exprs.forEach((se) => {
    if (se[0] === op) {
      res.push(...se.slice(1));
      return;
    } 
    res.push(se);
  });
  return res;
};

export default association;
