import render from './render.js';

// TODO: Find a less hacky way of doing this
// (rollup imports element/* before index)
void (async () => {
  const response = await fetch('presentation.xml');
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');

  const rendered = render(doc.documentElement);
  document.body.appendChild(rendered);
})();
