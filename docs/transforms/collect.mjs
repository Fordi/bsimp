

import { AND, OR } from "../consts.mjs";
import { areEqual, hasAnd, hasComplement, isAnd, isOr, findCommon, without } from "../tools.mjs";
import absorption from "./absorption.mjs";

// https://en.wikipedia.org/wiki/Boolean_algebra#Monotone_laws
// (∪ (∩ P Q) (∩ P R)) => (∩ P (∪ Q R))
// Do this only if this is an OR and the parent is an AND or top-level (null)
const collect = (exp, p) => {
  if (!(isOr(exp) && p !== OR)) return exp;
  if (!hasAnd(exp)) return exp;
  const ands = exp.slice(1).filter(isAnd);
  for (let pi = 0; pi < ands.length - 1; pi++) {
    for (let qi = pi + 1; qi < ands.length; qi++) {
      const { common, unique } = findCommon(ands[pi], ands[qi]);
      if (!common) continue;
      const others = without(without(exp, ands[pi]), ands[qi]);
      // It's possible that left and right are each other's complements
      const u = unique.map((t) => t.length === 1 ? t[0] : [AND, ...t]);
      const uQR = [OR, ...u];
      if (!(
        // Potential advantage 1: we reduce to a single AND and parent is an AND,
        //  so we'll be able to associate upwards
        //  e.g., A & ((B & A) | (B & C)) => A & B & (A | C)
        (others.length === 1 && p === OR)
        // Advantage 2: collected expression contains a complement, which can be
        //  eliminated to a single bool, then identitied out
        //  e.g., (B & C) | (B & !C) => B & (C | !C) => B & TRUE => B
        || hasComplement(uQR)
        // Advantage 3: collected expression will absorb
        // e.g., (!A & B) | A => B | A
        || !areEqual(uQR, absorption(uQR))
      // No advantages? try the next pair.
      )) continue;
      const group = [AND, ...common, uQR];
      if (others.length > 1) {
        return [...others, group];
      }
      return group;
    }
  }
  return exp;
};

export default collect;
