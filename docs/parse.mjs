import parser from './boolGrammar.mjs';
import { symbolize } from './tools.mjs';
export const parse = (str) => symbolize(parser.parse(str));
