import { registerElement } from './index.js';

registerElement('presentation', (element) => {
  type Transition = (data: {
    oldDiv: HTMLDivElement;
    newDiv: HTMLDivElement;
    transitionDiv: HTMLDivElement;
    args: string[];
    durationMS: number;
  }) => Promise<void>;

  const transitions: Record<string, Transition> = {
    async none() {
      renderSlide();
    },
    async fade({ oldDiv, newDiv, transitionDiv, durationMS }) {
      transitionDiv.style.display = 'grid';

      oldDiv.style.gridColumn = '1';
      oldDiv.style.gridRow = '1';

      newDiv.style.gridColumn = '1';
      newDiv.style.gridRow = '1';

      oldDiv.style.backgroundColor = newDiv.style.backgroundColor =
        slideDiv.style.backgroundColor;

      const start = Date.now();

      while (transitionDiv.parentElement === slideDiv) {
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const tMS = Date.now() - start;
        const t = tMS / durationMS;

        if (t >= 1) break;

        newDiv.style.opacity = String(t);
      }
    },
    async slide({ oldDiv, newDiv, transitionDiv, durationMS, args }) {
      const axisBase: 'X' | 'Y' = vertical ? 'Y' : 'X';
      let axisPage: 'X' | 'Y' | undefined;
      let axisSpecified: 'X' | 'Y' | undefined;

      for (const arg of args) {
        if (arg === 'horizontal') {
          axisSpecified = 'X';
          continue;
        }

        if (arg === 'vertical') {
          axisSpecified = 'Y';
          continue;
        }

        if (arg === 'auto') {
          axisSpecified = undefined;
          continue;
        }

        if (arg === 'page=horizontal') {
          axisPage = 'X';
        }

        if (arg === 'page=vertical') {
          axisPage = 'Y';
        }

        // ? Should I include?
        // page already defaults to horizontal because of technical limitations
        if (arg === 'page=auto') {
          axisPage = undefined;
        }
      }

      const axis = axisSpecified || (page && axisPage) || axisBase;

      transitionDiv.style.display = 'grid';

      oldDiv.style.gridColumn = '1';
      oldDiv.style.gridRow = '1';

      newDiv.style.gridColumn = '1';
      newDiv.style.gridRow = '1';

      const start = Date.now();

      while (transitionDiv.parentElement === slideDiv) {
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const tMS = Date.now() - start;
        const t = tMS / durationMS;

        if (t >= 1) break;

        oldDiv.style.transform = `translate${axis}(${-t * direction * 100}%)`;
        newDiv.style.transform = `translate${axis}(${(1 - t) * direction * 100}%)`;
      }
    },
  };

  const slideDiv = document.createElement('div');
  slideDiv.style.width = '100vw';
  slideDiv.style.height = '100vh';

  slideDiv.style.backgroundColor =
    {
      light: 'white',
      dark: '#1f1f1f',
    }[element.getTheme()] ?? '';

  const minIndex = 0;
  const maxIndex = element.children.length - 1;

  let i = minIndex;

  let lastRenderableChildI = i;

  let direction = 0;
  // ArrowUp or ArrowDown
  let vertical = false;
  // PageUp or PageDown
  let page = false;

  document.addEventListener('keydown', (event) => {
    direction = 0;

    // ? Should I make Page[Up|Down] horizontal or vertical?
    // It might seem like an obvious choice at first but remember
    // that PageUp and PageDown are used by presentation controllers
    // to navigate between slides.

    switch (event.key) {
      case 'ArrowUp':
        direction = -1;
        vertical = true;
        page = false;
        break;

      case 'PageUp':
        direction = -1;
        vertical = false;
        page = true;
        break;

      case 'ArrowLeft':
        direction = -1;
        vertical = false;
        page = false;
        break;

      case 'ArrowDown':
        direction = +1;
        vertical = true;
        page = false;
        break;

      case 'PageDown':
        direction = +1;
        vertical = false;
        page = true;
        break;

      case 'ArrowRight':
        direction = +1;
        vertical = false;
        page = false;
        break;
    }

    lastRenderableChildI = i;

    i += direction;

    if (i < minIndex) i = minIndex;
    if (i > maxIndex) i = maxIndex;

    updateSlide();
  });

  renderSlide();

  return slideDiv;

  function updateSlide(): void {
    const child = element.children[i];

    let transitionArgs: string[] = [];

    const transition = element.getAttribute('transition');
    if (transition !== null) {
      transitionArgs = transition.split(' ');
    }

    if (child.tagName.toLowerCase() === 'transition') {
      i += direction;

      if (i < minIndex) i = minIndex;
      if (i > maxIndex) i = maxIndex;

      executeTransition([...transitionArgs, ...child.innerHTML.split(' ')]);

      return;
    }

    executeTransition(transitionArgs);
  }

  function executeTransition(args: string[]): void {
    let durationMS = 200;

    let transition: Transition = transitions.none;

    const extra: string[] = [];

    for (const arg of args) {
      if (arg in transitions) {
        transition = transitions[arg as keyof typeof transitions];

        continue;
      }

      if (arg.endsWith('s')) {
        let durationS = parseFloat(arg);

        if (arg.endsWith('ms')) {
          durationS /= 1000;
        }

        durationMS = durationS * 1000;

        continue;
      }

      extra.push(arg);
    }

    const oldChild = element.children[lastRenderableChildI];
    const newChild = element.children[i];

    if (oldChild === newChild) return;

    const oldRendered = element.renderer.renderNode(oldChild);
    const newRendered = element.renderer.renderNode(newChild);

    const oldDiv = document.createElement('div');
    oldDiv.appendChild(oldRendered);

    oldDiv.id = 'old';

    const newDiv = document.createElement('div');
    newDiv.appendChild(newRendered);

    newDiv.id = 'new';

    const transitionDiv = document.createElement('div');
    transitionDiv.appendChild(oldDiv);
    transitionDiv.appendChild(newDiv);

    slideDiv.replaceChildren(transitionDiv);

    void (async () => {
      await transition({
        oldDiv,
        newDiv,
        transitionDiv,
        args: extra,
        durationMS,
      });

      // When transitionDiv is removed, we should abort the function
      // however, the function still resolves when aborted, which means
      // we must check if transitionDiv was removed / it was aborted
      // to not remove the current transition (that overruled it)
      if (transitionDiv.parentElement === slideDiv) renderSlide();
    })();
  }

  function renderSlide(): void {
    const child = element.children[i];

    const rendered = element.renderer.renderNode(child);

    slideDiv.replaceChildren(rendered);
  }
});
