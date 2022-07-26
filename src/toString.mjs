import { AND, FALSE, NOT, OR, TRUE } from './consts.mjs';
import { isExpression } from './tools.mjs';

export const SET = Symbol('set notation');
export const POLISH = Symbol('polish notation');
export const LOGIC = Symbol('logic notation');
export const SOURCE = Symbol('pasteable');

let defaultNotation = SET;

const toSetString = exp => {
  if (typeof exp === 'symbol') {
    return exp.description;
  }
  if (isExpression(exp) && exp.length === 1) {
    return 'Empty set';
  }

  if (!exp[SET]) {
    const [operation, ...operands] = exp;
    const value = operation === NOT
      ? (toSetString(operation) + toSetString(operands[0]))
      : `(${operands.map(toSetString).join(toSetString(operation))})`;
    Object.defineProperty(exp, SET, { value });
  }
  return exp[SET];
};

export const toPolishString = exp => {
  if (typeof exp === 'symbol') {
    return exp.description;
  }
  if (isExpression(exp) && exp.length === 1) {
    return '()';
  }
  if (!exp[POLISH]) {
    const [operation, ...operands] = exp;
    const value = operation === NOT
      ? `${toPolishString(operation)}${toPolishString(operands[0])}`
      : `(${toPolishString(operation).trim()} ${operands.map(toPolishString).join(' ')})`;
    Object.defineProperty(exp, POLISH, { value });
  }
  return exp[POLISH];
};

export const toLogicString = exp => {
  if (exp === TRUE) return '1';
  if (exp === FALSE) return '0';
  if (typeof exp === 'symbol') {
    return exp.description;
  }
  if (isExpression(exp) && exp.length === 1) {
    return '∅';
  }
  if (!exp[LOGIC]) {
    const [operation, ...operands] = exp;
    let value;
    if (operation === NOT) {
      value = `!${toLogicString(operands[0])}`;
    }
    if (operation === AND) {
      value = operands.map(toLogicString).join('');
    }
    if (operation === OR) {
      value = `(${operands.map(toLogicString).join('+')})`;
    }
    Object.defineProperty(exp, LOGIC, { value });
  }
  return exp[LOGIC];
};

const srcMap = {
  [AND]: 'AND',
  [OR]: 'OR',
  [NOT]: 'NOT',
  [TRUE]: 'TRUE',
  [FALSE]: 'FALSE',
};

export const toSource = (exp) => {
  if (typeof exp === 'symbol') {
    return srcMap[exp] ?? exp.description;
  }
  if (isExpression(exp) && exp.length === 1) {
    return 'undefined';
  }
  if (!exp[SOURCE]) {
    Object.defineProperty(exp, SOURCE, {
      value: `[${exp.map(toSource).join(', ')}]`
    });
  }
  return exp[SOURCE];
};

const toString = (exp, mode) => {
  const m = mode ?? defaultNotation;
  if (m === SET) {
    return (
      toSetString(exp)
        .replace(/∩ !/g, '∖ ')
        .replace(/^\((.*)\)$/g, '$1')
    );
  }
  if (m === POLISH) {
    return toPolishString(exp);
  }
  if (m === LOGIC) {
    return (
      toLogicString(exp)
        .replace(/^\((.*)\)$/g, '$1')
    );
  }
  return toSource(exp);
};

export const setNotation = (v) => {
  defaultNotation = v;
};

Object.assign(toString, {
  setNotation,
  SET,
  POLISH,
  LOGIC,
  SOURCE,
});

export default toString;