export const rules = {
  absorption: {
    name: 'Absorption',
    href: 'https://en.wikipedia.org/wiki/Absorption_(logic)',
    desc: 'A term is absorbed by virtue of it being used in adjacent expressions',
    parent: false,
  },
  association: {
    name: 'Association',
    href: 'https://en.wikipedia.org/wiki/Associative_property',
    desc: 'The subgroup can be rolled into the parent group, as they use the same operator',
    parent: true,
  },
  collect: {
    name: 'Antidistribution',
    href: 'https://en.wikipedia.org/wiki/Distributive_property',
    desc: 'Like terms can be collected into subgroups',
    parent: false,
  },
  complement: {
    name: 'Complementation',
    href: 'https://en.wikipedia.org/wiki/Boolean_algebra#Nonmonotone_laws',
    desc: 'A term is operated against its own complement, resulting in a constant or itself',
    parent: false,
  },
  consensus: {
    name: 'Consensus',
    href: 'https://en.wikipedia.org/wiki/Consensus_theorem',
    desc: 'In a union of three or more intersections, two intersections contain a complement with each of the terms of another intersection.',
    parent: false,
  },
  deMorgan: {
    name: 'DeMorgan\'s law of complementation',
    href: 'https://en.wikipedia.org/wiki/De_Morgan%27s_laws',
    desc: 'To either get rid of a group negation, or to collapse a group into its parent via association, we can complement the group.',
    parent: true,
  },
  distribute: {
    name: 'Distribution',
    href: 'https://en.wikipedia.org/wiki/Distributive_property',
    desc: 'The groups can be cross-multiplied to flatten out the expression.',
    parent: false,
  },
  identity: {
    name: 'Identity',
    href: 'https://en.wikipedia.org/wiki/Boolean_algebra#Monotone_laws',
    desc: 'An operation on a term that will result in the elimination of that term.',
    parent: false,
  },
  tautology: {
    name: 'Tautology',
    href: 'https://en.wikipedia.org/wiki/Boolean_algebra#Monotone_laws',
    desc: 'An operation on a term which results in that term.',
    parent: false,
  },
  sort: {
    name: 'Commutation',
    href: 'https://en.wikipedia.org/wiki/Commutative_property',
    desc: 'The terms can be sorted within their expressions to normalize them.',
    parent: false,
  }
};