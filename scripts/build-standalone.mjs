import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
let html = readFileSync(join(root, 'dist/index.html'), 'utf8');
const script = html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
const style = html.match(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/);
if (!script || !style) throw new Error('Expected one Vite script and stylesheet.');
const readAsset = path => readFileSync(join(root, 'dist', path.replace(/^\//, '')), 'utf8');
const js = readAsset(script[1]);
const css = readAsset(style[1]);
if (/import\.meta|\bimport\s*\(/.test(js) || /url\s*\(/.test(css)) {
  throw new Error('Standalone exporter requires a bundle without external asset imports.');
}
html = html.replace(script[0], '').replace(style[0], () => `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`);
// A classic inline script at the end of body also works when opened via file://.
html = html.replace('</body>', () => `<script>${js.replace(/<\/script/gi, '<\\/script')}</script>\n</body>`);
if (/<(?:script|link)\b[^>]*(?:src|href)=/i.test(html)) throw new Error('Unexpected external dependency.');
html = html.replace(/\r\n?/g, '\n').replace(/^[ \t]+$/gm, '');
writeFileSync(join(root, 'Ledger Console.html'), html);
mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs/index.html'), html);
console.log('Standalone: Ledger Console.html (no server or installation required)');
