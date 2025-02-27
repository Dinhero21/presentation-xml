export function decodeHTMLElements(html: string): string {
  const textarea = document.createElement('textarea');

  textarea.innerHTML = html;

  return textarea.value;
}
