/* globals expect */

import { symbolize } from './tools.mjs';
import toString, { LOGIC, POLISH, SET, SOURCE } from './toString.mjs';

const region_0x03 = ['OR', ['AND', 'A', 'B', 'C'], ['AND', 'A', ['NOT', 'B'], ['NOT', 'C']]];
const region_0x70 = ['OR', ['AND', 'C', ['NOT', 'A']], ['AND', 'B', 'C']];
const plainTruth = ['AND', 'TRUE', 'FALSE'];
const emptySet = ['OR'];
const fixtures = [region_0x03, region_0x70, plainTruth, emptySet].map(symbolize);
const formats = [SET, POLISH, LOGIC, SOURCE];
describe('toString', () => {
  formats.forEach((format) => {
    it(`serializes expressions in ${format.description}`, () => {
      fixtures.forEach((exp) => {
        expect(toString(exp, format)).toMatchSnapshot();
        toString.setNotation(format);
        expect(toString(exp)).toMatchSnapshot();
      });
    });
  });
});