import { createHighlighter } from 'shiki/bundle/web';

import { registerElement } from './index.js';
import { isText } from './text.js';

const highlighterPromise = createHighlighter({
  themes: ['one-dark-pro', 'one-light'],
  langs: ['html', 'css', 'js'],
});

registerElement('code', (element) => {
  const span = document.createElement('span');

  let structure = element.getAttribute('structure') as
    | 'inline'
    | 'classic'
    | null;

  if (structure === null) {
    structure = isText(element.original.parentElement) ? 'inline' : 'classic';
  }

  highlighterPromise.then((highlighter) => {
    span.innerHTML = highlighter.codeToHtml(
      element.original.textContent ?? element.original.innerHTML,
      {
        lang: 'javascript',
        theme: { dark: 'one-dark-pro', light: 'one-light' }[
          element.getTheme()
        ] as 'one-dark-pro' | 'one-light',
        structure,
      },
    );
  });

  return span;
});
