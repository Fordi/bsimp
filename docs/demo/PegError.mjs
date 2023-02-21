import { html } from './html.mjs';

export const PegError = ({ error, expr }) => {
  if (!error) return null;
  return html`
    <div class="error">
      ${error?.message}
      ${error?.location && html`
        <pre>
          ${' '}
          ${expr}
          ${'\n'}
          ${new Array(error.location.start.offset + 1).join(' ')}
          ${'>'}
          ${new Array(error.location.end.offset - error.location.start.offset + 2).join(' ')}
          ${'<'}
        </pre>
      `}
    </div>
  `;
};