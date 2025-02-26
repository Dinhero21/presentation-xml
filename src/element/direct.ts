import { registerElement } from './index.js';

registerElement('svg', (element) => element.original as HTMLElement);
