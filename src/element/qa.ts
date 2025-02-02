import { registerElement } from './index.js';
import { renderSlide } from './slide.js';
import { renderText } from './text.js';

registerElement('QA', (element) => {
  element.custom.set('question', (element) => {
    element.default.size = '5rem';

    return renderText(element);
  });

  element.custom.set('answer', (element) => {
    element.default.size = '2rem';
    element.default.color = 'gray';

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
