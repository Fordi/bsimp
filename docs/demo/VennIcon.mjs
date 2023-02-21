import { html } from './html.mjs';

export const VennIcon = ({ className, color="currentColor", size = 64 }) => html`
  <svg
    fill=${color}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width=${size}
    height=${size}
    className=${className}
  >
    <path d="M12 24a19 19 0 0 1 16 0 23 23 0 0 0-8 14 20 20 0 0 1-8-14zm12 16a21 21 0 0 1 8-13c4 3 7 8 8 13-5 2-11 2-16 0zm8-38c10 0 19 8 20 18a24 24 0 0 0-20 2 24 24 0 0 0-20-2C13 10 22 2 32 2Zm29 50c-5 9-16 13-25 8a24 24 0 0 0 8-17 24 24 0 0 0 12-17c8 6 11 17 5 26zM3 52c5 9 16 13 25 8a24 24 0 0 1-8-17A24 24 0 0 1 8 26a20 20 0 0 0-5 26zm49-28a20 20 0 0 1-8 14c-1-5-4-10-8-14 5-2 10-2 16 0zM32 58a20 20 0 0 1-8-13 24 24 0 0 0 16 0 20 20 0 0 1-8 13z"/>
  </svg>
`;
