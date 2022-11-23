import { contains, isAnd, isOr, invert, without } from "../tools.mjs";
import unwrap from "./unwrap.mjs";

// https://en.wikipedia.org/wiki/Absorption_(logic)
// (∪ P (∩ P Q) ...) <=> (∪ P ...)
// (∪ (∩ !P Q) P) <=> (∪ P Q)
// (∪ (∩ P Q) !P) <=> (∪ !P Q)
const absorption = (exp) => {
  if (!isOr(exp)) return exp;
  let work = exp;
  for (let pi = 1; pi < work.length; pi++) {
    const P = work[pi];
    if (!isAnd(P)) continue;
    for (let qi = 1; qi < work.length; qi++) {
      if (qi === pi) continue;
      const Q = work[qi];
      const notQ = invert(Q);
      if (contains(P, Q)) {
        work = without(work, P);
      } else if (contains(P, notQ)) {
        work = [...work];
        work[pi] = unwrap(without(P, notQ));
      }
    }
  }
  return work;
};

export default absorption;
