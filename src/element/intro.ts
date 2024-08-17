import { registerElement } from './index.js';
import { renderSlide } from './slide.js';
import { renderText } from './text.js';

registerElement('Intro', (element) => {
  element.custom.set('title', (element) => {
    if (element.getAttribute('size') === null)
      element.setAttribute('size', '10em');

    return renderText(element);
  });

  element.custom.set('subtitle', (element) => {
    if (element.getAttribute('color') === null)
      element.setAttribute('color', 'gray');
    if (element.getAttribute('size') === null)
      element.setAttribute('size', '5em');

    return renderText(element);
  });

  const div = renderSlide(element);
  div.style.textAlign = 'center';
  div.style.alignContent = 'center';

  return div;
});
