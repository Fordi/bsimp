
import { useState, useEffect } from 'preact/hooks';
import { html } from './html.mjs';
import { renderSvg } from './renderSvg.mjs';

export const ShortcutIcon = ({ icon: Image, ...props }) => {
  const [href, setHref] = useState(null);
  useEffect(() => {
    renderSvg(Image, props).then((result) => {
      setHref(result);
    })
  }, [Image, props]);
  return href && html`
    <link rel="shortcut icon" ref=${(a) => document.head.appendChild(a)} href=${href} />
  `;
};