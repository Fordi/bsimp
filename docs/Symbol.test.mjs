import { MockSymbol, isMockSymbol } from './Symbol.mjs';

describe('Mocked Symbol', () => {
  it('returns a unique symbol for each call, regardless of description', () => {
    expect(MockSymbol('test')).not.toBe(MockSymbol('test'));
  });
  it('can be used as an index into an object', () => {
    const x = {};
    const s = MockSymbol('test');
    const r = Math.random().toString();
    x[s] = r;
    expect(s in x).toBe(true);
    expect(x[s]).toBe(r);
  });
});

describe('MockSymbol.for', () => {
  it('returns the same symbol for the same description', () => {
    expect(MockSymbol.for('test')).toBe(MockSymbol.for('test'));
  });
});

describe('isMockSymbol', () => {
  it('returns true only for MockSymbols', () => {
    expect(isMockSymbol(MockSymbol('test'))).toBe(true);
    expect(isMockSymbol({ description: 'test' })).toBe(false);
  })
});