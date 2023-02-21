import { render } from 'preact';
import { html } from './html.mjs';

export const renderSvg = async (Image, props = {}) => {
  const target = document.createElement('div');
  target.style.position = 'absolute';
  target.style.opacity = 1;
  document.body.appendChild(target);
  render(html`<${Image} ...${props} />`, target);
  const svg = target.firstElementChild;
  const svgXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>${(new XMLSerializer()).serializeToString(svg)}`;
  const [w, h] = [svg.clientWidth, svg.clientHeight];
  document.body.removeChild(target);

  const svgDataUrl = `data:image/svg+xml,${encodeURIComponent(svgXml)}`;
  const svgImg = document.createElement('img');
  await new Promise((resolve, reject) => {
    svgImg.onload = () => resolve(svgImg);
    svgImg.onerror = reject;
    svgImg.src = svgDataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.style.opacity = 0;
  canvas.style.position = 'absolute';
  document.body.appendChild(canvas);
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(svgImg, 0, 0, w, h);
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  document.body.removeChild(canvas);
  return dataUrl;
};