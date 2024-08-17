import { PresentationElement } from './index.js';

export function renderSlide(element: PresentationElement) {
  const div = document.createElement('div');
  div.style.width = '100vw';
  div.style.height = '100vh';

  element.renderChildren(div);

  return div;
}
