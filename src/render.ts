import { ELEMENT_MAP, PresentationElement, Renderer } from './element/index.js';

export class PresentationRenderer {
  public readonly custom: Map<string, Renderer> = new Map();

  public renderNode<T extends Node>(
    node: T,
  ): T extends Element ? HTMLElement : Node {
    if (!(node instanceof Element)) {
      return node.cloneNode(true) as T extends Element ? never : Node;
    }

    return this.renderElement(node);
  }

  public renderElement(original: Element): HTMLElement {
    const element = new PresentationElement(original, this.clone());

    const name = original.tagName;

    if (name.startsWith('html.')) {
      const html = document.createElement(name.slice('html.'.length));
      element.renderInto(html);

      return html;
    }

    const renderer = this.custom.get(name) ?? ELEMENT_MAP.get(name);

    if (renderer === undefined) throw new Error(`Unknown element: ${name}`);

    return renderer(element);
  }

  // ? Should I use structuredClone instead?
  public clone(): PresentationRenderer {
    const renderer = new PresentationRenderer();

    for (const [k, v] of this.custom) renderer.custom.set(k, v);

    return renderer;
  }
}
