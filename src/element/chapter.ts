import { registerElement } from './index.js';
import { renderSlide } from './slide.js';
import { renderText } from './text.js';

registerElement('Chapter', (element) => {
  element.custom.set('title', (element) => {
    element.default.size = '10rem';

    return renderText(element);
  });

  element.custom.set('subtitle', (element) => {
    element.default.color = 'gray';
    element.default.size = '5rem';

    return renderText(element);
  });

  const div = renderSlide(element);
  div.style.textAlign = 'center';
  div.style.alignContent = 'center';

  return div;
});
