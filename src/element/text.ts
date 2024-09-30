import { PresentationElement, registerElement } from './index.js';

export function renderText(element: PresentationElement) {
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
  element.default.size ??= '3em';

  const p = document.createElement('p');
  element.renderInto(p);

  const color = element.getAttribute('color');
  const size = element.getAttribute('size');
  const weight = element.getAttribute('weight');
  const family = element.getAttribute('family');

  if (color !== null) p.style.color = color;
  if (size !== null) p.style.fontSize = size;
  if (weight !== null) p.style.fontWeight = weight;
  if (family !== null) p.style.fontFamily = family;

  return p;
}

registerElement('text', renderText);
