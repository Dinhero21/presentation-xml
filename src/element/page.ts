import { registerElement } from './index.js';
import { renderSlide } from './slide.js';
import { renderText } from './text.js';

registerElement('Page', (element) => {
  element.custom.set('important', (element) => {
    element.default.size ??= '5rem';
    element.default.color ??= 'white';

    return renderText(element);
  });

  element.custom.set('text', (element) => {
    element.default.size ??= '2.5rem';
    element.default.color ??= 'gray';

    return renderText(element);
  });

  const outer = renderSlide(element);
  outer.style.alignContent = 'center';

  const inner = renderSlide(element);
  outer.replaceChildren(inner);

  inner.style.margin = 'auto';
  inner.style.width = 'calc(100vw - min(10vw, 10vh))';
  inner.style.height = 'calc(100vh - min(10vw, 10vh))';

  return outer;
});
