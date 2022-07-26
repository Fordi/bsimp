const registry = new Map();

const SYM_ID = `Symbol(Symbol)_${Math.random().toString(36).substring(2)}`

export const MockSymbol = (description) => {
  const symobj = {};
  const id = `Symbol(${description})_${Math.random().toString(36).substring(2)}`;
  Object.defineProperties(symobj, {
    description: { value: description },
    toString: { value: () => id },
    valueOf: { value: symobj },
    [SYM_ID]: { value: true },
  });
  return Object.freeze(symobj);
};

MockSymbol.for = (description) => {
  if (!registry.has(description)) {
    registry.set(description, MockSymbol(description));
  }
  return registry.get(description);
};

export const isMockSymbol = (t) => !!t[SYM_ID];

export const isSymbol = (
  globalThis.Symbol
    ? (t) => typeof t === 'symbol'
    : isMockSymbol
);

export default globalThis.Symbol ?? MockSymbol;