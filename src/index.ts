// TODO: Find a less hacky way of doing this

import { PresentationRenderer } from './render.js';

// (rollup imports element/* before index)
void (async () => {
  const response = await fetch('presentation.xml');
  const text = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');

  const renderer = new PresentationRenderer();
  const rendered = renderer.renderElement(doc.documentElement);

  document.body.appendChild(rendered);
})();
