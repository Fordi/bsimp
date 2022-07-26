/* globals expect */
import parser from './boolGrammar.mjs';
import { symbolize } from './tools.mjs';
import { simplify } from './simplify.mjs';

const parse = (s) => symbolize(parser.parse(s));

describe('simplify', () => {
  it('simplifies logical expressions', () => {
    expect(simplify(parse('A!B!C+AB!C+AC!B+ABC'))).toEqual(parse('A'));
    expect(simplify(parse('A!B!C+AB!C'))).toEqual(parse('A!C'));
    expect(simplify(parse('A!B!C+AB!C+AC!B'))).toEqual(parse('A!B+A!C'));
    expect(simplify(parse('A!B!C+AB!C+B!A!C+AC!B+BC!A+ABC'))).toEqual(parse('A+B'));
    expect(simplify(parse('A(!B!C+C!B+B!C+BC)+C'))).toEqual(parse('A+C'));
    expect(simplify(parse('A(!B!C+C!B+B(!C+C))+C'))).toEqual(parse('A+C'));
  });
  it('applies complements', () => {
    expect(simplify(parse('A+!A'))).toEqual(parse('TRUE'));
    expect(simplify(parse('A!A'))).toEqual(parse('FALSE'));
  });
  it('applies association', () => {
    expect(simplify(parse('(u (u P Q) R)'))).toEqual(parse('(u P Q R)'));
    expect(simplify(parse('(n (n P Q) R)'))).toEqual(parse('(n P Q R)'));
    expect(simplify(parse('(u !(n P Q) R)'))).toEqual(parse('(u R !P !Q)'));
    expect(simplify(parse('(n !(u P Q) R)'))).toEqual(parse('(n R !P !Q)'));
  });
  it('applies a deMorgan inversion if negated and parent is a complementary operation', () => {
    expect(simplify(parse('A or !(B and C)'))).toEqual(parse('A or !B or !C'));
  });
  it('Collects / distributes if operation is complementary to parent', () => {
    expect(simplify(parse('(n S (∪ (∩ P Q) (∩ P R)))'))).toEqual(parse('(u PQS PRS)'));
  });
  it('Understands consensus', () => {
    expect(simplify(parse('(u PQ P!R QR)'))).toEqual(parse('(u P!R QR)'));
    expect(simplify(parse('(u PQS P!RS QRS)'))).toEqual(parse('(u P!RS QRS)'));
    expect(simplify(parse('(u PQS P!RS QRT)'))).toEqual(parse('(u PQS P!RS QRT)'));
  });
  it('Collapses identities', () => {
    expect(simplify(parse('(u TRUE P)'))).toEqual(parse('TRUE'));
    expect(simplify(parse('(u Q FALSE)'))).toEqual(parse('Q'));
    expect(simplify(parse('(n Q TRUE)'))).toEqual(parse('Q'));
    expect(simplify(parse('(n FALSE P)'))).toEqual(parse('FALSE'));
  });
  it('Collapses tautologies', () => {
    expect(simplify(parse('(u P P)'))).toEqual(parse('P'));
    expect(simplify(parse('(u P Q P)'))).toEqual(parse('P+Q'));
    expect(simplify(parse('(n P P)'))).toEqual(parse('P'));
    expect(simplify(parse('(n P Q P)'))).toEqual(parse('PQ'));
  });
  it('involutes doubled negatives', () => {
    expect(simplify(parse('!!P'))).toEqual(parse('P'));
    expect(simplify(symbolize(['NOT', ['NOT', 'P']]))).toEqual(parse('P'));
  });
  it('involutes immediates', () => {
    expect(simplify(parse('!1'))).toEqual(parse('0'));
    expect(simplify(parse('!0'))).toEqual(parse('1'));
  });
});