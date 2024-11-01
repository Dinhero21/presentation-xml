import { PresentationRenderer } from './render.js';

// For whatever reason not exported
type CompressionFormat = 'deflate' | 'deflate-raw' | 'gzip';

// this function shouldn't ever be imported
// it's called by rollup footer
export async function entry(): Promise<void> {
  let text: string | undefined;

  const params = new URLSearchParams(window.location.search);

  const url = params.get('fetch');
  if (url !== null) {
    const response = await fetch(url);
    text = await response.text();
  }

  const base64 = params.get('base64');
  if (base64 !== null) {
    const compressionFormat = params.get('compression');

    if (compressionFormat !== null) {
      // base64 --> string
      const compressedString = atob(base64);

      // string --> uint8[]
      const compressedUint8Array = Uint8Array.from(
        compressedString,
        (character) => character.charCodeAt(0),
      );

      // uint8[] -gzip-> stream
      const decompressionStream = new DecompressionStream(
        compressionFormat as CompressionFormat,
      );
      const writer = decompressionStream.writable.getWriter();
      writer.write(compressedUint8Array);
      writer.close();

      // stream --> arraybuffer
      const decompressedArrayBuffer = await new Response(
        decompressionStream.readable,
      ).arrayBuffer();

      // arraybuffer --> text
      const decoder = new TextDecoder();
      text = decoder.decode(decompressedArrayBuffer);
    } else {
      text = atob(base64);
    }
  }

  if (text === undefined) return;

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');

  const parsererror = doc.querySelector('parsererror');

  if (parsererror !== null) {
    document.body.replaceChildren(
      document.createTextNode('DOMParser error:'),
      parsererror,
    );

    throw new Error('Invalid XML - parsererror element present', {
      cause: parsererror,
    });
  }

  try {
    const renderer = new PresentationRenderer();
    const rendered = renderer.renderElement(doc.documentElement);

    document.body.replaceChildren(rendered);
  } catch (error) {
    const div = document.createElement('div');

    div.style.backgroundColor = 'red';
    div.style.font = 'monospace';

    div.replaceChildren(document.createTextNode(String(error)));

    if (error instanceof Error) {
      document.body.replaceChildren(
        document.createTextNode('PresentationRenderer Error:'),
        div,
      );
    }

    throw new Error(
      `PresentationRenderer Error: ${error instanceof Error ? error.message : error}`,
      {
        cause: error,
      },
    );
  }
}

const fileUploadInput = document.getElementById(
  'file-upload',
) as HTMLInputElement;
const compressionSelect = document.getElementById(
  'compression',
) as HTMLSelectElement;
const goButton = document.getElementById('go') as HTMLButtonElement;

goButton.addEventListener('click', async () => {
  const file = fileUploadInput.files?.[0];
  if (file === undefined) return;

  const text = await file.text();

  const params = new URLSearchParams(window.location.search);

  let base64: string;

  const compressionFormat = compressionSelect.value as
    | CompressionFormat
    | 'none';

  if (compressionFormat !== 'none') {
    params.set('compression', compressionFormat);

    // text --> uint8[]
    const encoder = new TextEncoder();
    const decompressedUint8Array = encoder.encode(text);

    // uint8[] -gzip-> stream
    const compressionStream = new CompressionStream(
      compressionFormat as CompressionFormat,
    );
    const writer = compressionStream.writable.getWriter();
    writer.write(decompressedUint8Array);
    writer.close();

    // stream --> arraybuffer
    const compressedArrayBuffer = await new Response(
      compressionStream.readable,
    ).arrayBuffer();

    // arraybuffer --> uint8[]
    const compressedUint8Array = new Uint8Array(compressedArrayBuffer);

    // uint8[] --> string
    const compressedString = String.fromCharCode(...compressedUint8Array);

    // string --> base64
    base64 = btoa(compressedString);
  } else {
    base64 = btoa(text);
  }

  params.set('base64', base64);

  window.location.search = params.toString();
});

// It would be good to have this enabled on prod but not dev
// window.addEventListener('error', (event) => {
//   const error = event.error;

//   alert(error);
// });
