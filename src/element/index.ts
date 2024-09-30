import render from '../render.js';

export class PresentationElement {
  public readonly default: Record<string, string | undefined> = {};

  constructor(
    public readonly original: Element,
    public readonly custom = new Map<string, Renderer>(),
  ) {}

  public renderNode(node: Node): Node {
    return render(node, this.custom);
  }

  public renderInto(other: HTMLElement): void {
    other.style.cssText += this.getAttribute('style') ?? '';

    this.renderChildren(other);
  }

  protected renderChildren(other: Node): void {
    for (const node of this.original.childNodes) {
      const rendered = this.renderNode(node);

      other.appendChild(rendered);
    }
  }

  public getTheme(): string {
    let theme = getAttribute(this.original, 'theme') ?? 'light';

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }

    return theme;
  }

  // b.size -> defaults 10px
  //
  // <a><b>                        -> 10px
  // <a><b size="10px">            -> 10px
  // <a size="50%"><b>             -> 5px
  // <a size="50%"><b size="10px"> -> 10px
  //
  // parent multiplier should be applied to default

  public getAttribute(name: string, includeDefault = true): string | null {
    let attribute = getAttribute(this.original, name);

    let multiplier: number | undefined;

    if (attribute !== null) {
      multiplier = getMultiplier(attribute);
      if (multiplier !== undefined) {
        attribute = null;
      }
    }

    if (attribute === null && includeDefault) {
      attribute = this.default[name] ?? null;

      if (multiplier !== undefined)
        attribute = `calc(${multiplier} * (${attribute}))`;

      (() => {
        const parent = this.original.parentElement;
        if (parent === null) return;

        const parentAttribute = parent.getAttribute(name);
        if (parentAttribute === null) return;

        const multiplier = getMultiplier(parentAttribute);

        attribute = `calc(${multiplier} * (${attribute}))`;
      })();
    }

    return attribute;

    function getMultiplier(attribute: string): number | undefined {
      if (attribute.endsWith('%')) {
        return parseFloat(attribute) / 100;
      }

      if (attribute.endsWith('x')) {
        return parseFloat(attribute);
      }
    }
  }

  public setAttribute(name: string, value: string): void {
    this.original.setAttribute(name, value);
  }

  public get children(): HTMLCollection {
    return this.original.children;
  }
}

export type Renderer = (element: PresentationElement) => HTMLElement;

export const ELEMENT_MAP: Map<string, Renderer> = new Map();

export function registerElement(name: string, renderer: Renderer): void {
  ELEMENT_MAP.set(name, renderer);
}

export function getAttribute(element: Element, name: string): string | null {
  const attribute = element.getAttribute(name);
  if (attribute !== null) return attribute;

  const parent = element.parentElement;
  if (parent !== null) return getAttribute(parent, name);

  return null;
}
