import { App } from './App.mjs';
import { render } from 'preact';
import { html } from './html.mjs';
import { renderSvg } from './renderSvg.mjs';
import { VennIcon } from './VennIcon.mjs';

render(html`<${App} />`, document.querySelector('#app'));
