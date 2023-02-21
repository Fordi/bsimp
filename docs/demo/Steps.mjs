import { toString } from '@fordi-org/bsimp';
import { html } from './html.mjs';
import { modes } from './modes.mjs';
import { rules } from './rules.mjs';

export const Steps = ({ mode, steps }) => {
  if (!steps.length) return null;
  return html`
    <h2>Steps</h2>
    <table>
      <thead>
        <tr>
          <td>Transform</td>
          <td>From</td>
          <td>To</td>
        </tr>
      </thead>
      <tbody>
        ${steps.map(([step, parentOp, from, to, root]) => {
          if (!(step in rules)) return null;
          const { name, href, desc, parent } = rules[step];
          return html`
            <tr>
              <td>
                <a href=${href} target="_blank" rel="noopener noreferer">
                  ${name}
                  ${' '}
                  ${(parent && parentOp) && ` (${toString(parentOp, modes[mode])})`}
                </a>
              </td>
              <td>${toString(from, modes[mode])}</td>
              <td>${toString(to, modes[mode])}</td>
            </tr>
            <tr>
              <td colspan="4">${desc}</td>
            </tr>
          `;
        })}
      </tbody>
    </table>
  `;
};