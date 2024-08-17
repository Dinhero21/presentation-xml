import render from '../render.js';

export class PresentationElement {
  constructor(
    public readonly original: Element,
    public readonly custom = new Map<string, Renderer>()
  ) {}

  public renderChildren(other: Node): void {
    for (const node of this.original.childNodes) {
      const rendered = this.render(node);

      other.appendChild(rendered);
    }
  }

  public render(node: Node): Node {
    return render(node, this.custom);
  }

  public getTheme(): string {
    let theme = getAttribute(this.original, 'theme') ?? 'light';

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme = 'dark';
    }

    return theme;
  }

  public getAttribute(name: string): string | null {
    return getAttribute(this.original, name);
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
