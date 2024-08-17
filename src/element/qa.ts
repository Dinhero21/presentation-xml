import { registerElement } from './index.js';
import { renderSlide } from './slide.js';
import { renderText } from './text.js';

registerElement('QA', (element) => {
  element.custom.set('question', (element) => {
    if (element.getAttribute('size') === null)
      element.setAttribute('size', '5em');

    return renderText(element);
  });

  element.custom.set('answer', (element) => {
    if (element.getAttribute('size') === null)
      element.setAttribute('size', '2em');

    if (element.getAttribute('color') === null)
      element.setAttribute('color', 'gray');

    return renderText(element);
  });

  const outer = renderSlide(element);
  outer.style.alignContent = 'center';

  const inner = renderSlide(element);
  outer.replaceChildren(inner);

  inner.style.margin = 'auto';
  inner.style.width = '90vw';
  inner.style.height = '90vh';

  return outer;
});
