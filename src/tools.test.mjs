/* globals expect */
import parser from './boolGrammar.mjs';
import { findCommon, getSymbols, interpret, invert, symbolize, term } from './tools.mjs';
import { AND, FALSE, NOT, OR, TRUE } from './consts.mjs';

const parse = (s) => symbolize(parser.parse(s));

describe('invert', () => {
  it('returns [NOT, expr]', () => {
    expect(invert('A')).toEqual([NOT, 'A']);
  });
  it('unwraps an existing NOT', () => {
    expect(invert([NOT, 'A'])).toEqual('A');
  });
  it('knows the boolean immediates', () => {
    expect(invert(TRUE)).toEqual(FALSE);
    expect(invert(FALSE)).toEqual(TRUE);
  });
});

describe('symbolize', () => {
  it('converts known keywords to their symbols', () => {
    expect(symbolize('AND')).toBe(AND);
    expect(symbolize('OR')).toBe(OR);
    expect(symbolize('NOT')).toBe(NOT);
    expect(symbolize('TRUE')).toBe(TRUE);
    expect(symbolize('FALSE')).toBe(FALSE);
  });
  it('elides over symbols', () => {
    const temp = Symbol('temp');
    expect(symbolize(temp)).toBe(temp);
  });
  it('symbolized expressions', () => {
    const symA = term('A');
    expect(symbolize(['NOT', 'A'])).toEqual([NOT, symA]);
  });
  it('throws an error on a bad expression', () => {
    expect(() => symbolize({})).toThrow();
  });
});

describe('getSymbols', () => {
  it('Returns the known set of symbols for an expression', () => {
    const terms = Array.from('ABCDEFG').map(term);
    const expr = parse('ABC+DE(F+G)');
    expect(getSymbols(expr)).toEqual(terms);
  });
  it('Throws an error when passed an invalid expression', () => {
    expect(() => getSymbols([{}])).toThrow();
  });
});

describe('interpret', () => {
  it('Creates an interpreter based on a passed expression', () => {
    const int = interpret(parse('A+B+(!1 & !0)+0'));
    expect(int({ A: false, B: false })).toEqual(false);
    expect(int({ A: false, B: true })).toEqual(true);
    expect(int({ A: true, B: false })).toEqual(true);
    expect(int({ A: true, B: true })).toEqual(true);
  });
  it('Throws an error when passed a bad operator', () => {
    expect(() => interpret([Symbol('XOR'), 'A', 'B'])).toThrow();
  });
  it('Throws an error when passed a bad expression', () => {
    expect(() => interpret({})).toThrow();
  });
});

describe('findCommon', () => {
  it('Returns an empty object if passed fewer than two expressions', () => {
    expect(findCommon([])).toEqual({});
  });
});
