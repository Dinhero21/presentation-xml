import dedent from 'dedent';

import { decodeHTMLElements } from './html.js';

export function getTextContent(element: Element): string {
  // dedent(element.textContent)
  return decodeHTMLElements(dedent(element.innerHTML));
}
