import { PresentationElement, registerElement } from './index.js';

export const TEXTUAL_SYMBOL = Symbol('element.type=text');

declare global {
  interface Node {
    [TEXTUAL_SYMBOL]?: boolean;
  }
}

export function isText(element: Element | null): boolean {
  while (element !== null) {
    if (element[TEXTUAL_SYMBOL] === true) return true;
    element = element.parentElement;
  }

  return false;
}

export function renderText(element: PresentationElement) {
  element.original[TEXTUAL_SYMBOL] = true;

  element.custom.set('bold', (element) => {
    const b = document.createElement('b');
    element.renderInto(b);

    return b;
  });

  element.custom.set('italic', (element) => {
    const i = document.createElement('i');
    element.renderInto(i);

    return i;
  });

  element.default.color ??=
    {
      light: 'black',
      dark: 'white',
    }[element.getTheme()] ?? '';
  element.default.size ??= '3rem';

  const inText = isText(element.original.parentElement);

  const text = document.createElement(inText ? 'span' : 'p');
  element.renderInto(text);

  const color = element.getAttribute('color');
  const size = element.getAttribute('size');
  const weight = element.getAttribute('weight');
  const family = element.getAttribute('family');

  if (color !== null) text.style.color = color;
  if (size !== null) text.style.fontSize = size;
  if (weight !== null) text.style.fontWeight = weight;
  if (family !== null) text.style.fontFamily = family;

  return text;
}

registerElement('text', renderText);
