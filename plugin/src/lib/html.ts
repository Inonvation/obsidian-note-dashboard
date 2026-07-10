/**
 * Lightweight HTML tagged template helper.
 * Returns a plain string — drop-in replacement for string concatenation.
 * Use with es6-string-html (VS Code extension) for syntax highlighting.
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += String(values[i] ?? '');
    }
  }
  return result;
}
