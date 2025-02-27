import { createHighlighter } from 'shiki/bundle/web';

import { getTextContent } from '../util/element.js';
import { registerElement } from './index.js';
import { isText, renderText } from './text.js';

const highlighterPromise = createHighlighter({
  themes: ['one-dark-pro', 'one-light'],
  langs: ['html', 'css', 'js'],
});

registerElement('code', (element) => {
  const textContent = getTextContent(element.original);

  // why not clearing element.original's children?
  //   apparently that causes this function to get
  //   called again on the new element

  // this is so renderChildren isn't
  // called (it is in renderText),
  // for performance reasons
  (element as any).renderChildren = () => {};
  const text = renderText(element);

  let structure = element.getAttribute('structure') as
    | 'inline'
    | 'classic'
    | null;

  if (structure === null) {
    structure = isText(element.original.parentElement) ? 'inline' : 'classic';
  }

  highlighterPromise.then((highlighter) => {
    text.innerHTML = highlighter.codeToHtml(textContent, {
      lang: element.getAttribute('lang') ?? 'js',
      theme: { dark: 'one-dark-pro', light: 'one-light' }[
        element.getTheme()
      ] as 'one-dark-pro' | 'one-light',
      structure,
    });
  });

  return text;
});
