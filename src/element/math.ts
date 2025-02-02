import { render } from 'katex';

import { registerElement } from './index.js';
import { renderText } from './text.js';

registerElement('math', (element) => {
  const text = renderText(element);

  render(text.innerHTML, text);

  return text;
});

document.head.insertAdjacentHTML(
  'beforeend',
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css" integrity="sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib" crossorigin="anonymous">',
);
