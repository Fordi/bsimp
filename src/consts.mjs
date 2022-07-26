import Symbol from './Symbol.mjs';

export const AND = Symbol(' ∩ ');
export const OR = Symbol(' ∪ ');
export const NOT = Symbol('!');

export const TRUE = Symbol('TRUE');
export const FALSE = Symbol('FALSE');

export const KEYWORDS = { AND, OR, NOT, TRUE, FALSE, 1: TRUE, 0: FALSE };
