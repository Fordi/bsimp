import peg from 'pegjs';

import { readFile, writeFile, mkdir } from 'fs/promises';

const grammarSrc = await readFile('docs/boolGrammar.pegjs', 'utf-8');

await writeFile(
  'docs/boolGrammar.mjs',
  peg.generate(grammarSrc, {
    output: 'source',
    format: 'commonjs',
  }).replace(/\nmodule\.exports = /, '\nexport default '),
  'utf-8',
);
