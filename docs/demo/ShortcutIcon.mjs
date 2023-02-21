
import { useState, useEffect } from 'preact/hooks';
import { html } from './html.mjs';
import { renderSvg } from './renderSvg.mjs';

export const ShortcutIcon = ({ icon: Image, ...props }) => {
  const [href, setHref] = useState(null);
  const [linkEl, setLinkEl] = useState(null);
  useEffect(() => {
    renderSvg(Image, props).then((result) => {
      setHref(result);
    })
  }, [Image, props]);
  useEffect(() => {
    linkEl && document.head.appendChild(linkEl);
    return () => {
      linkEl && document.head.removeChild(linkEl);
    }
  }, [linkEl])
  return href && html`
    <link rel="shortcut icon" ref=${(a) => setLinkEl(a)} href=${href} />
  `;
};