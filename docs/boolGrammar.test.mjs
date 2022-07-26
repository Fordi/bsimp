/* globals expect */
/*
import peg from 'pegjs';
import { readFileSync } from 'fs';
const parser = peg.generate(readFileSync(new URL('./boolGrammar.pegjs', import.meta.url).pathname, 'utf-8'));
*/
import parser from './boolGrammar.mjs';

const region_0x03 = ['OR', ['AND', 'A', 'B', 'C'], ['AND', 'A', ['NOT', 'B'], ['NOT', 'C']]];
const region_0x70 = ['OR', ['AND', 'C', ['NOT', 'A']], ['AND', 'B', 'C']];

describe('parse', () => {
  it('parses terse logical grammar', () => {
    expect(parser.parse('ABC+A!B!C')).toEqual(region_0x03);
  });
  it('parses infix grammar with mixed programming symbols', () => {
    expect(parser.parse('A & B && C || A * !B * ~C')).toEqual(region_0x03);
  });
  it('parses polish grammar with set symbols', () => {
    expect(parser.parse('(u (∩ A B C) (∩ A !B !C))')).toEqual(region_0x03);
  });
  it('parses mixed polish, terse, and infix grammar, and mixed symbols', () => {
    expect(parser.parse('[u ABC (A AND !B && ¬C)]')).toEqual(region_0x03);
    expect(parser.parse('[u ABC (A \\ B && ¬C)]')).toEqual(region_0x03);
  });
  it('parses a union of groups in set notation', () => {
    expect(parser.parse('(C ∖ A) ∪ (B ∩ C)')).toEqual(region_0x70);
  });
  it('parses polish nand / nor sensibly', () => {
    expect(parser.parse('\\ A B C')).toEqual(['AND', 'A', ['NOT', 'B'], ['NOT', 'C']]);
    expect(parser.parse('- A B C')).toEqual(['OR', 'A', ['NOT', 'B'], ['NOT', 'C']]);
  });
  it('parses ternaries as logic', () => {
    expect(parser.parse('a ? b : c')).toEqual(['OR', ['AND', 'a', 'b'], ['AND', ['NOT', 'a'], 'c']]);
  });
});