import { AND } from "../consts.mjs";
import { areEqual, contains, isAnd, isOr, findCommon, invert, sortExpr, without } from "../tools.mjs";

// https://en.wikipedia.org/wiki/Consensus_theorem
// (u (n P Q) (n P !R) (n Q R) ...) => (u (n P !R) (n Q R) ...)
// The resolvant of (n P !R) and (n Q R) is (n P Q), so it can be removed.

const findResolvant = (l, r) => {
  const exclude = [];
  const terms = [...l.slice(1), ...r.slice(1)];
  let hasResolvant = false;
  terms.forEach(P => {
    const _P = invert(P);
    if (contains(r, _P)) {
      exclude.push(P);
      exclude.push(_P);
      hasResolvant = true;
    }
  });
  if (!hasResolvant) return null;
  const resolvant = new Set(terms.filter(P => !exclude.some((p) => areEqual(p, P))));
  return sortExpr([AND, ...Array.from(resolvant)]);
};

const consensus = (exp) => {
  if (!isOr(exp)) return exp;
  let work = exp;
  const ands = exp.slice(1).filter(isAnd);
  if (ands.length < 3) return exp;
  const { unique } = findCommon(...ands);
  const uands = unique ? unique.map((t) => [AND, ...t]) : ands;
  for (let i = 0; i < uands.length; i++) {
    for (let j = 0; j < uands.length; j++) {
      if (i === j) continue;
      const res = findResolvant(uands[i], uands[j]);
      if (res) {
        for (let k = 0; k < uands.length; k++) {
          if (k === i || k === j) continue;
          if (areEqual(res, uands[k])) {
            return without(work, ands[k]);
          }
        }
      }
    }
  }
  return exp;
};

export default consensus;
