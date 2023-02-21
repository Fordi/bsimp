
import { useRef, useState, useEffect } from 'preact/hooks';
import { parse, simplify, toString } from "@fordi-org/bsimp";
import { html } from './html.mjs';
import { useSharedState } from './useSharedState.mjs';
import { modes } from './modes.mjs';
import { Steps } from './Steps.mjs';
import { ForeignDocument } from './ForeignDocument.mjs';
import { VennIcon } from './VennIcon.mjs';
import { ShortcutIcon } from './ShortcutIcon.mjs';
import { PegError } from './PegError.mjs';

export const App = () => {
  const inpRef = useRef(null);
  const [mode, setMode] = useSharedState('mode', Object.keys(modes)[0]);
  const [expr, setExpr] = useSharedState('expr', '');
  const [out, setOut] = useState('');
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(undefined);
  const onModeChange = (e) => {
    setMode(e.target.value);
  };
  const onSimplify = () => {
    setExpr(inpRef.current.value);
  };
  useEffect(() => {
    if (!expr) {
      setOut('');
      setSteps([]);
      setError(null);
      requestAnimationFrame(() => {
        inpRef.current.focus();
      });
      return;
    }
    try {
      const e = parse(expr);
      const steps = [];
      const s = simplify(e, steps);
      setOut(toString(s, modes[mode]));
      setError(undefined);
      setSteps(steps);
      requestAnimationFrame(() => {
        inpRef.current.focus();
      });
    } catch (e) {
      console.warn(e);
      setError(e);
      setOut('');
      setSteps([]);
      requestAnimationFrame(() => {
        inpRef.current.focus();
        if (e.location) {
          const { start, end } = e.location;
          inpRef.current.setSelectionRange(start.offset, end.offset);
        }
      });
    }
  }, [mode, expr]);
  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSimplify();
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };
  
  return html`
    <${ShortcutIcon} icon=${VennIcon} size="16" color="red" />
    <div className="demo">
      <h1>
        <${VennIcon} size="1em" />
        ${' '}
        Boolean simplifier
      </h1>
      <a href="https://github.com/Fordi/bsimp">API Documentation</a>
      <div className="form">
        <label htmlFor="input">
          <div>Enter expression:</div>
          <textarea autofocus onKeyDown=${onKeyDown} id="input" ref=${inpRef}>${expr}</textarea>
        </label>
        <label htmlFor="mode">
          <span>
            Output style:
          </span>
          <select id="mode" onChange=${onModeChange}>
            ${Object.keys(modes).map((key) => html`
              <option ...${key === mode && { selected: true }}>
                ${key}
              </option>
            `)}
          </select>
        </label>
        <div className="actions">
          <button onClick=${onSimplify}>Simplify</button>
        </div>
        <${PegError} error=${error} expr=${expr} />
        <label className="output">
          <div>Simplified:</div>
          <textarea readonly>${out}</textarea>
        </label>
        <${Steps} steps=${steps} mode=${mode} />
      </div>
      <h2>Grammar</h2>
      <${ForeignDocument}
        src=${new URL('../boolGrammar.html', import.meta.url).toString()}
        postProcess=${(dom) => {
          ['h1', 'h2'].forEach(s => {
            const h = dom.querySelector(s);
            h.parentNode.removeChild(h);
          });
        }}
      />
    </div>
  `;
};

