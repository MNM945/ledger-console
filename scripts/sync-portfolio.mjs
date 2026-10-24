import { access, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const flag = process.argv.indexOf('--portfolio');
if (flag < 0 || !process.argv[flag + 1]) throw new Error('Usage: node scripts/sync-portfolio.mjs --portfolio /path/to/portfolio_01');
const target = resolve(process.argv[flag + 1]);
if (target === root) throw new Error('The portfolio must be a separate folder.');
const record = JSON.parse(await readFile(join(root, 'docs/portfolio.json'), 'utf8'));
let index = await readFile(join(target, 'index.html'), 'utf8');
let build = await readFile(join(target, 'scripts/build-static.mjs'), 'utf8');
if (!index.includes('const PROJECTS = CONTENT.projects;') || !index.includes('<div class="repo-table">')) throw new Error('Unrecognized portfolio structure; no files changed.');
const screenshots = ['ledger-dark.jpg', 'ledger-light.jpg', 'permission-denied.jpg', 'refund-arabic-light.jpg'];
const files = [
  ['Ledger Console.html', 'projects/ledger-console/index.html'],
  ...screenshots.map(name => [`docs/validation/${name}`, `assets/ledger-console/${name}`]),
];
await Promise.all(files.map(([source]) => access(join(root, source))));
const scriptTag = '<script src="articles/ledger-console.js"></script>';
if (!index.includes(scriptTag)) {
  const contentScript = /<script src="content\.js[^\"]*"><\/script>/;
  if (!contentScript.test(index)) throw new Error('Cannot locate the content entry point.');
  index = index.replace(contentScript, match => `${match}\n${scriptTag}`);
}
if (!index.includes('data-project-key="ledgerconsole"')) {
  const card = `\n        <a class="repo-card" href="#ledgerconsole" data-project-key="ledgerconsole">\n          <h2>Ledger Console</h2>\n          <p>A financial-interface concept with reusable React components, explicit money rules and recoverable states.</p>\n          <span class="row-arrow" aria-hidden="true">↗</span>\n        </a>`;
  index = index.replace('<div class="repo-table">', '<div class="repo-table">' + card);
}
if (!index.includes('"Ledger Console": "ledgerconsole"')) {
  index = index.replace('const PROJECT_KEY_BY_TITLE = {', 'const PROJECT_KEY_BY_TITLE = {\n  "Ledger Console": "ledgerconsole",');
}
for (const directory of ['articles', 'projects/ledger-console']) {
  const line = build.match(/const releaseDirectories = \[([^\]]+)\];/);
  if (!line) throw new Error('Cannot locate the release directory list.');
  if (!line[1].includes(`"${directory}"`)) build = build.replace(line[0], `const releaseDirectories = [${line[1]}, "${directory}"];`);
}
const module = `// Generated from ledger-console/docs/portfolio.json. Edit that source and re-run sync.\n(() => {\n  const record = ${JSON.stringify(record, null, 2)};\n  const index = CONTENT.projects.findIndex(project => project.key === record.project.key);\n  if (index >= 0) CONTENT.projects[index] = record.project;\n  else CONTENT.projects.splice(6, 0, record.project);\n  BUILD_PROJECT_DETAILS[record.project.key] = record.system;\n})();\n`;
for (const [source, destination] of files) {
  await mkdir(dirname(join(target, destination)), {recursive: true});
  await cp(join(root, source), join(target, destination));
}
await mkdir(join(target, 'articles'), {recursive: true});
await writeFile(join(target, 'articles/ledger-console.js'), module);
await writeFile(join(target, 'index.html'), index);
await writeFile(join(target, 'scripts/build-static.mjs'), build);
console.log('Synced Ledger Console article, demo and four screenshots. Other article sources were not rewritten.');
