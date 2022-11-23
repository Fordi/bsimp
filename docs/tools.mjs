import { AND, FALSE, KEYWORDS, NOT, OR, TRUE } from './consts.mjs';
import Symbol, { isSymbol } from './Symbol.mjs';

const OPERATORS = { [AND]: AND, [OR]: OR, [NOT]: NOT };

// If an expression is an expression.  That is, it's an array with the first item being
//  an operator.
export const isExpression = exp => Array.isArray(exp) && !!OPERATORS[exp[0]];
export const isOr = exp => isExpression(exp) && exp[0] === OR;
export const isAnd = exp => isExpression(exp) && exp[0] === AND;
export const isNot = exp => isExpression(exp) && exp[0] === NOT && !!exp[1];
export { isSymbol };

// Whether `expression` contains `subexpression`
export const contains = (expression, subexpression) => (
  expression.slice(1).some(se => areEqual(se, subexpression))
);

export const areEqual = (e1, e2, involute = true) => {
  
  if (involute) {
    // treat !!EXP as EXP
    [e1, e2] = [e1, e2].map(e => involution(e));
  }
  // If either are falsy, they're inequal (for our purposes)
  if (!e1 || !e2) return false;
  // Fastest end: if they're the same object, they're equal
  if (e1 === e2) return true;
  // If either is a symbol, but they're not the same object, they're inequal.
  if (isSymbol(e1) || isSymbol(e2)) return false;
  // If they're expressions of different lengths, they're inequal
  if (e1.length !== e2.length) return false;
  // If any subpart is inequal, they're inequal.
  if (e1.some((p, i) => !areEqual(e2[i], p))) return false;
  // If all checks pass, they're equal.
  return true;
};

// Whether the expression contains two terms that are complements of one another.
export const hasComplement = (expression) => {
  for (let p = 1; p < (expression.length - 1); p++) {
    const P = expression[p];
    for (let q = p + 1; q < expression.length; q++) {
      const Q = expression[q];
      const notQ = invert(Q);
      if (areEqual(P, notQ)) return true;
    }
  }
  return false;
};

// Expression contains one or more OR operation
export const hasOr = (expression) => expression.slice(1).some(isOr);
// Expression contains one or more AND operation
export const hasAnd = (expression) => expression.slice(1).some(isAnd);

export const findCommon = (...exps) => {
  const nExps = exps.length;
  //Different operations or non-expression; return nothing.
  if (nExps < 2 || exps.some((e) => !isExpression(e) || e[0] !== exps[0][0])) {
    return {};
  }
  const terms = [];
  exps.forEach((exp, ei) => {
    exp.slice(1).forEach((t) => {
      const haveCommon = terms.some((item) => {
        if (areEqual(t, item[0])) {
          item[1].push(ei);
          return true;
        }
        return false;
      });
      if (!haveCommon) {
        terms.push([t, [ei]]);
      }
    });
  });
  const common = terms.filter((t) => t[1].length === nExps).map(([T]) => T);
  const unique = terms.reduce((r, [T, where]) => {
    if (where.length === nExps) return r;
    where.forEach((ei) => {
      r[ei].push(T);
    });
    return r;
  }, exps.map(() => []));

  // No common values.
  if (!common.length) return {};
  // Return as subexpressions
  return {
    common,
    unique
  };
};

export const without = (exp, sub) => [exp[0], ...exp.slice(1).filter(se => !areEqual(se, sub))];

const terms = {};

// Create the symbol
export const term = name => {
  if (isSymbol(name)) {
    name = name.description;
  }
  if (!terms[name]) {
    terms[name] = {
      term: Symbol(name),
      index: Object.keys(terms).length,
    };
  }
  return terms[name].term;
};

export const order = (t, p) => {
  if (isSymbol(t) || typeof t === 'string') {
    return terms[term(t).description].index * 2;
  }
  if (isNot(t)) return order(t[1]) + 1;
  return (Object.keys(terms).length * (p === t[0] ? 2 : 4)) + t.slice(1).reduce((s, p) => s + order(p), 0);
};

export const sortExpr = (exp) => {
  if (isNot(exp) || isSymbol(exp)) return exp;
  const [p, ...subs] = exp;
  const exprs = subs.sort((a, b) => order(a, p) - order(b, p)).map(s => sortExpr(s));
  // Rewrite the expression
  if (exprs.some((a) => !isNot(a))) {
    while (isNot(exprs[0])) {
      // Rotate until the first arg is not a NOT.
      // This is so !ABC can be written with SET notation's `\`, e.g.,
      // !ABC -> BC!A -> B n C \ A.
      // !A!BC -> C \ A \ B
      // What happens if they're all nots?  You get a leading not, that's all,
      // e.g., !A!B!C -> !A \ B \ C
      // This is technically an empty set, though.
      exprs.push(exprs.shift());
    }
    return [p, ...exprs];
  }
  return exp;
};

export const invert = (expression) => {
  if (isNot(expression)) return expression[1];
  if (expression === TRUE) return FALSE;
  if (expression === FALSE) return TRUE;
  return [NOT, expression];
};

export const symbolize = (expression) => {
  if (typeof expression === 'string') return KEYWORDS[expression] ?? term(expression);
  if (isSymbol(expression)) return expression;
  if (Array.isArray(expression)) return expression.map(t => symbolize(t));
  throw new Error(`Invalid expression: ${expression.toString()}`);
};

export const getSymbols = (expression) => {
  const result = new Set();
  const addExpression = (exp) => {
    if (isSymbol(exp)) {
      if (exp === AND || exp === OR || exp === NOT || exp === TRUE || exp === FALSE) {
        return;
      }
      result.add(exp);
      return;
    }
    exp.forEach(e => addExpression(e));
  };
  addExpression(symbolize(expression));
  return Array.from(result);
};

export const interpret = (expression) => {
  if (expression === TRUE) return () => true;
  if (expression === FALSE) return () => false;
  if (isSymbol(expression) && !KEYWORDS[expression]) {
    return (props) => props[expression.description];
  }
  if (isExpression(expression)) {
    if (expression[0] === OR) {
      const int = expression.slice(1).map(interpret);
      return (props) => int.reduce((s, t) => s || t(props), false);
    }
    if (expression[0] === AND) {
      const int = expression.slice(1).map(interpret);
      return (props) => int.reduce((s, t) => s && t(props), true);
    }
    const int = interpret(expression[1]);
    return (props) => !int(props);
}
  if (Array.isArray(expression)) {
    throw new Error(`Unknown operator: ${expression[0].toString()}`);
  }
  throw new Error(`Invalid expression: ${expression.toString()}`);
};

// https://en.wikipedia.org/wiki/Boolean_algebra#Nonmonotone_laws (double negation)
// !!P => P; !!!!P => P; etc.
export const involution = (exp) => {
  while (isNot(exp) && isNot(exp[1])) {
    exp = exp[1][1];
  }
  return exp;
};
