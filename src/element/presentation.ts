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

      while (true) {
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const tMS = Date.now() - start;
        const t = tMS / durationMS;

        if (t >= 1) break;

        newDiv.style.opacity = String(t);
      }

      renderSlide();
    },
    async slide({ oldDiv, newDiv, transitionDiv, durationMS, args }) {
      const axis: 'X' | 'Y' = args.includes('vertical') ? 'Y' : 'X';

      transitionDiv.style.display = 'grid';

      oldDiv.style.gridColumn = '1';
      oldDiv.style.gridRow = '1';

      newDiv.style.gridColumn = '1';
      newDiv.style.gridRow = '1';

      const start = Date.now();

      while (true) {
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const tMS = Date.now() - start;
        const t = tMS / durationMS;

        if (t >= 1) break;

        oldDiv.style.transform = `translate${axis}(${-t * direction * 100}%)`;
        newDiv.style.transform = `translate${axis}(${(1 - t) * direction * 100}%)`;
      }

      renderSlide();
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

  let direction = 0;

  document.addEventListener('keydown', (event) => {
    direction = 0;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        direction = -1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
        direction = +1;
        break;
    }

    i += direction;

    if (i < minIndex) i = minIndex;
    if (i > maxIndex) i = maxIndex;

    updateSlide();
  });

  updateSlide();

  return slideDiv;

  function updateSlide(): void {
    const child = element.children[i];

    let transitionArgs: string[] = [];

    const transition = element.getAttribute('transition');
    if (transition !== null) {
      transitionArgs = transition.split(' ');
    }

    if (child.tagName.toLowerCase() === 'transition') {
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

    const oldChild = element.children[i - direction];
    const newChild = element.children[i + direction];

    i += direction;

    const oldRendered = element.renderNode(oldChild);
    const newRendered = element.renderNode(newChild);

    const oldDiv = document.createElement('div');
    oldDiv.appendChild(oldRendered);

    const newDiv = document.createElement('div');
    newDiv.appendChild(newRendered);

    const transitionDiv = document.createElement('div');
    transitionDiv.appendChild(oldDiv);
    transitionDiv.appendChild(newDiv);

    slideDiv.replaceChildren(transitionDiv);

    void transition({
      oldDiv,
      newDiv,
      transitionDiv,
      args: extra,
      durationMS,
    });
  }

  function renderSlide(): void {
    const child = element.children[i];

    const rendered = element.renderNode(child);

    slideDiv.replaceChildren(rendered);
  }
});
