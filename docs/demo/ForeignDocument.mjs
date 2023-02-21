import { html } from './html.mjs';
import { useRef, useEffect } from 'preact/hooks';

export const ForeignDocument = ({ src, postProcess = () => {} }) => {
  const docRef = useRef(null);
  useEffect(async () => {
    const text = await fetch(src).then(r => r.text());
    const dom = new DOMParser().parseFromString(text, 'text/html');
    postProcess(dom);
    [...dom.querySelectorAll('body>*')].forEach((node) => {
      docRef.current.appendChild(document.importNode(node, true));
    });
    [...dom.querySelectorAll('head>*')].forEach((node) => {
      if (/STYLE|LINK|SCRIPT/.test(node.tagName)) {
        docRef.current.appendChild(document.importNode(node, true));
      }
    });
  }, []);
  return html`<div ref=${docRef}></div>`
};