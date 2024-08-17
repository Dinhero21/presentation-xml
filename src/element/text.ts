import { PresentationElement, registerElement } from './index.js';

export function renderText(element: PresentationElement) {
  element.custom.set('bold', (element) => {
    const b = document.createElement('b');
    element.renderChildren(b);

    return b;
  });

  element.custom.set('italic', (element) => {
    const i = document.createElement('i');
    element.renderChildren(i);

    return i;
  });

  const p = document.createElement('p');
  element.renderChildren(p);

  let color = element.getAttribute('color');
  let size = element.getAttribute('size');
  const weight = element.getAttribute('weight');
  const family = element.getAttribute('family');

  color ??=
    {
      light: 'black',
      dark: 'white',
    }[element.getTheme()] ?? '';

  size ??= '3em';

  if (color !== null) p.style.color = color;
  if (size !== null) p.style.fontSize = size;
  if (weight !== null) p.style.fontWeight = weight;
  if (family !== null) p.style.fontFamily = family;

  return p;
}

registerElement('text', renderText);
