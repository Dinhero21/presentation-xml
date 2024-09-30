import { ELEMENT_MAP, PresentationElement, Renderer } from './element/index.js';

/**
 * Node (commonly XMLElement) -> HTMLElement
 */
export default function render(
  node: Node,
  custom = new Map<string, Renderer>(),
): Node {
  if (!(node instanceof Element)) return node.cloneNode(true);

  const element = new PresentationElement(node, custom);

  const name = node.tagName;

  if (name.startsWith('html.')) {
    const html = document.createElement(name.slice('html.'.length));
    element.renderInto(html);

    return html;
  }

  const renderer = ELEMENT_MAP.get(name) ?? custom.get(name);

  if (renderer === undefined) throw new Error(`Unknown element: ${name}`);

  return renderer(element);
}
