import { registerElement } from './index.js';

registerElement('presentation', (element) => {
  const div = document.createElement('div');
  div.style.width = '100vw';
  div.style.height = '100vh';

  div.style.backgroundColor =
    {
      light: 'white',
      dark: '#1f1f1f',
    }[element.getTheme()] ?? '';

  const min = 0;
  const max = element.children.length - 1;

  let i = min;

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

    if (i < min) i = min;
    if (i > max) i = max;

    renderChild();
  });

  renderChild();

  element.custom.set('transition', (transitionElement) => {
    let durationMS = 200;

    const transitions = { fade };

    let transition = fade;

    for (const arg of transitionElement.original.innerHTML.split(' ')) {
      if (arg.endsWith('s')) {
        let durationS = parseFloat(arg);

        if (arg.endsWith('ms')) {
          durationS /= 1000;
        }

        durationMS = durationS * 1000;

        continue;
      }

      if (arg in transitions) {
        transition = transitions[arg as keyof typeof transitions];

        continue;
      }

      throw new Error(`Unknown transition argument: ${arg}`);
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

    const div = document.createElement('div');
    div.appendChild(oldDiv);
    div.appendChild(newDiv);

    transition();

    return div;

    async function fade(): Promise<void> {
      div.style.display = 'grid';

      oldDiv.style.gridColumn = '1';
      oldDiv.style.gridRow = '1';

      newDiv.style.gridColumn = '1';
      newDiv.style.gridRow = '1';

      oldDiv.style.opacity = '1';
      newDiv.style.opacity = '0';

      const start = Date.now();

      while (true) {
        await new Promise((resolve) => requestAnimationFrame(resolve));

        const tMS = Date.now() - start;
        const t = tMS / durationMS;

        if (t >= 1) break;

        newDiv.style.opacity = String(t);
        oldDiv.style.opacity = String(1 - t);
      }

      renderChild();
    }
  });

  return div;

  function renderChild(): void {
    const child = element.children[i];
    const rendered = element.renderNode(child);

    div.replaceChildren(rendered);
  }
});
