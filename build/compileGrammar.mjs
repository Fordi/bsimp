import peg from 'pegjs';
import { readFile, writeFile } from 'fs/promises';

const parser = peg.generate(await readFile('src/boolGrammar.pegjs', 'utf-8'), {
  output: 'source',
  format: 'commonjs',
});

const generateModern = async file => {
  await writeFile(
    file.replace(/\.pegjs$/, '.mjs'),
    peg
      .generate(
        await readFile(file, 'utf-8'),
        { output: 'source', format: 'commonjs' },
      )
      .replace(/\nmodule\.exports = /, '\nexport default '),
    'utf-8',
  )
};

generateModern('src/boolGrammar.pegjs');
