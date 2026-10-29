import {readFile, writeFile} from 'node:fs/promises';
import {transactions} from '../src/data/transactions.ts';
import {addMoney} from '../src/money.ts';
import {buildThemeDiagram} from './article-theme-diagram.mjs';

const file = new URL('../docs/portfolio.json', import.meta.url);
const record = JSON.parse(await readFile(file, 'utf8'));
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text = (en, zh, tag='span', attributes='') => `<${tag} data-lc-en="${escape(en)}" data-lc-zh="${escape(zh)}" ${attributes}>${escape(en)}</${tag}>`;
const heading = (id, en, zh, index) => `<div class="lc-viz-heading"><span class="lc-viz-index" aria-hidden="true">${index}</span>${text(en,zh,'h3',`id="${id}"`)}</div>`;
const arrow = '<span class="lc-viz-arrow" aria-hidden="true">→</span>';
const systemSrc = 'projects/ledger-console/examples.html?example=system&lang=en';
const system = `<figure class="lc-design-system" data-ledger-visual="system" aria-label="Ledger Console design system">
<iframe src="${escape(systemSrc)}" title="Ledger Console design system: tokens and components" data-lc-title-en="Ledger Console design system: tokens and components" data-lc-title-zh="Ledger Console 设计系统：令牌与组件" data-lc-example="system" loading="lazy" allow="clipboard-write"></iframe>
<figcaption><a href="${escape(systemSrc)}" data-lc-example-link="system" target="_blank" rel="noopener noreferrer">${text('Open design system ↗','单独打开设计系统 ↗')}</a><a href="projects/ledger-console/index.html" target="_blank" rel="noopener noreferrer">${text('Open ledger ↗','打开账本 ↗')}</a></figcaption>
</figure>`;

function refundPanel(transaction, kind) {
  const refund = transaction.refund;
  if (!refund || refund.kind !== kind) throw new Error(`Expected ${kind} refund fixture.`);
  const currency = transaction.currency;
  const money = value => `<bdi>${currency} ${value.toFixed(2)}</bdi>`;
  const original = addMoney(currency, transaction.amount, transaction.fee);
  const credit = addMoney(currency, refund.amount, refund.feeReturned);
  const remaining = addMoney(currency, original, -credit);
  return `<section class="lc-refund-panel lc-refund-panel--${kind}" aria-labelledby="lc-refund-title-${kind}">
<div class="lc-refund-record">${text(kind==='partial'?'Partial principal returned':'Full principal returned',kind==='partial'?'退回部分本金':'退回全部本金','h4',`id="lc-refund-title-${kind}"`)}<code>${transaction.id} · ${transaction.reference}</code></div>
<div class="lc-money-equation"><div>${text('Original debit','原始扣款','span')}<strong>${money(original)}</strong></div><span class="lc-money-operator" aria-hidden="true">−</span><div>${text('Refund credit','退款入账','span')}<strong>${money(credit)}</strong></div><span class="lc-money-operator" aria-hidden="true">=</span><div class="lc-money-remaining">${text('Remaining debit','剩余扣款','span')}<strong>${money(remaining)}</strong></div></div>
<dl class="lc-refund-breakdown"><div><dt>${text('Original principal','原始本金')}</dt><dd>${money(transaction.amount)}</dd></div><div><dt>${text('Original fee','原始费用')}</dt><dd>${money(transaction.fee)}</dd></div><div><dt>${text('Principal returned','退回本金')}</dt><dd>${money(refund.amount)}</dd></div><div><dt>${text('Fee returned','退回费用')}</dt><dd>${money(refund.feeReturned)}</dd></div></dl>
${text(kind==='full'?'Full refund returns all principal. The original fee remains under this demo policy.':'Partial refund leaves the unreturned principal plus the original fee.',kind==='full'?'该示例中，全额退款退回全部本金，原始费用仍按演示政策保留。':'部分退款后，剩余扣款由未退回本金与原始费用组成。','p','class="lc-viz-caption"')}
</section>`;
}

const partial = transactions.find(transaction => transaction.id === 'tx-015');
const full = transactions.find(transaction => transaction.id === 'tx-008');
if (!partial || !full) throw new Error('Article refund fixtures are missing.');
const money = `<figure class="lc-article-viz" data-ledger-visual="money" aria-label="Refund examples">
<fieldset class="lc-refund-explorer"><legend class="lc-viz-sr">${text('Choose a refund example','选择退款示例')}</legend>
<input class="lc-refund-radio" type="radio" name="lc-refund-example" id="lc-refund-partial" checked><label for="lc-refund-partial">${text('Partial refund · EUR','部分退款 · EUR')}</label>
<input class="lc-refund-radio" type="radio" name="lc-refund-example" id="lc-refund-full"><label for="lc-refund-full">${text('Full refund · USD','全额退款 · USD')}</label>
<div class="lc-refund-panels">${refundPanel(partial,'partial')}${refundPanel(full,'full')}</div></fieldset>
${text('Two separate fictional records. Currencies are never added together or converted. Values follow the source fixtures and integer minor-unit calculation.','这里是两笔独立的虚构记录，不跨币种相加或换算。数值取自源数据，并按整数最小单位计算。','figcaption','class="lc-viz-caption"')}
</figure>`;

record.project.details = record.project.details.filter(block => !block.includes('data-ledger-visual='));
record.project.details = record.project.details.filter(block => !block.includes('data-ledger-example='));
record.project.details = record.project.details.filter(block => !block.includes('data-ledger-money-notes'));
// Normalize generated anchor attributes before locating source section markers.
record.project.details = record.project.details.map(block => block.replace(/(<strong class="main-title") id="lc-section-[^"]+"/g, '$1'));
const handoffStart = record.project.details.indexOf('<strong class="main-title">English case study and README</strong>');
if (handoffStart >= 0) {
  const nextSection = record.project.details.findIndex((block, index) => index > handoffStart && block.includes('class="main-title"'));
  record.project.details.splice(handoffStart, (nextSection < 0 ? record.project.details.length : nextSection) - handoffStart);
}
const componentStatesStart = record.project.details.indexOf('<strong class="main-title">Component and state examples</strong>');
if (componentStatesStart >= 0) {
  const end = record.project.details.findIndex((block, index) => index > componentStatesStart && block.includes('class="main-title"'));
  record.project.details.splice(componentStatesStart, (end < 0 ? record.project.details.length : end) - componentStatesStart);
}
for (const [nextHeading, visual] of [
  ['Storybook and component documentation',system],
  ['Storybook and component documentation',await buildThemeDiagram()],
]) {
  const index = record.project.details.indexOf(`<strong class="main-title">${nextHeading}</strong>`);
  if (index < 0) throw new Error(`Cannot locate article section: ${nextHeading}`);
  record.project.details.splice(index,0,visual);
}
// Keep the introduction aligned with the paired, interactive examples below.
record.project.details = record.project.details.map(block => {
  if (block.includes('The header exposes persistent loading')) return text('Each example pairs a real interface state with a practical scenario. Try the available actions to see how a user can recover.','每个示例将真实界面状态与具体场景放在一起，可试用操作查看恢复路径。','p');
  if (block.includes('Blocked states hide transaction rows and filters.')) return text('The examples cover loading, empty results, connection errors, access, expired sessions and long text. Recovery actions operate on local example data.','示例涵盖加载、空数据、网络错误、权限、会话过期和长文本；恢复操作使用本地示例数据。','p');
  return block;
});
const moneyNotes = `<section class="lc-money-notes" data-ledger-money-notes aria-labelledby="lc-money-notes-title">
  ${text('Four details behind MoneyText','金额展示的四个细节','h3','id="lc-money-notes-title"')}
  <dl>
    <div>${text('ISO currency codes','ISO 币种代码','dt')}<dd>${text('Codes distinguish currencies that share a symbol.','用标准代码区分使用相同符号的币种。')}<code>USD 100.00 ≠ HKD 100.00</code></dd></div>
    <div>${text('Local formats','本地格式','dt')}<dd>${text('Separators and decimal places follow the locale and currency.','分隔符与小数位随地区和币种调整。')}<code>GBP 1,234.50 · JPY 1,234 · KWD 12.345</code></dd></div>
    <div>${text('Invalid amounts','无效金额','dt')}<dd>${text('Invalid input shows a fallback instead of zero.','无效输入显示占位提示，避免误认为零。')}<code>${text('Empty input → Amount unavailable','清空输入 → 金额不可用')}</code></dd></div>
    <div>${text('Bidirectional isolation','双向文本隔离','dt')}<dd>${text('Currency codes and numbers stay isolated inside RTL text.','在从右向左的文字中隔离币种代码与数字。')}<code><span dir="rtl" lang="ar">المبلغ <bdi dir="ltr">AED 2,322.95</bdi></span></code></dd></div>
  </dl>
</section>`;
const examples = [
  ['React + TypeScript page and components','components','01','Resize, sort and inspect','切换宽度、排序与查看详情','Change the layout width and open a transaction row.','切换布局宽度，并打开一行交易查看详情。'],
  ['Design tokens','tokens','02','Adjust the design tokens','调整设计令牌','Change color, radius and spacing; test the preview action.','调整颜色、圆角与间距，再点击预览按钮。'],
  ['Storybook and component documentation','storybook','03','Explore component variants','浏览组件变体','Choose a component and adjust its properties to inspect states and themes.','选择组件并调整属性，查看状态与主题变化。'],
  ['Boundary-state examples','states','04','Explore states and recovery','查看状态与恢复','See each state alongside its example and try the recovery actions.','对照说明查看每种状态，并试用恢复操作。'],
  ['Internationalization and accessibility','international','05','Try currencies, RTL and keyboard access','试用币种、RTL 与键盘操作','Switch locale and currency, then open and close the drawer using the keyboard.','切换语言与币种，再用键盘打开和关闭详情抽屉。'],
];
for(const [section,example,index,title,titleZh,instruction,instructionZh] of examples){
  const src=example==='storybook'?'projects/ledger-console/storybook/iframe.html?id=components-moneytext--interactive&viewMode=story&globals=theme:light':`projects/ledger-console/examples.html?example=${example}&lang=en`;
  const storybookUrl='projects/ledger-console/storybook/index.html?path=/docs/components-moneytext--docs';
  const label=`Ledger Console interactive example ${index}: ${title}`;
  const labelZh=`Ledger Console 交互示例 ${index}：${titleZh}`;
  const caption = example === 'storybook'
    ? `<div class="lc-example-caption lc-example-caption--compact"><span class="lc-example-number">LIVE ${index}</span><a href="${escape(storybookUrl)}" target="_blank" rel="noopener noreferrer">${text('Open Storybook ↗','打开 Storybook ↗')}</a></div>`
    : `<div class="lc-example-caption"><span class="lc-example-number">LIVE ${index}</span>${text(title,titleZh,'h3',`id="lc-example-heading-${example}"`)}${text(instruction,instructionZh,'p')}</div>`;
  const heading = example === 'storybook' ? 'lc-section-storybook' : `lc-example-heading-${example}`;
  const window=`<figure class="lc-example-window" data-ledger-example="${example}" aria-labelledby="${heading}">${caption}<iframe src="${escape(src)}" title="${escape(label)}" data-lc-title-en="${escape(label)}" data-lc-title-zh="${escape(labelZh)}" data-lc-example="${example}" loading="lazy" allow="clipboard-write"></iframe></figure>`;
  if (example === 'components') {
    const matrix=record.project.details.findIndex(block=>block.includes('class="delivery-matrix-wrap"'));
    if(matrix<0)throw new Error('Missing deliverable index table.');
    record.project.details.splice(matrix,0,window);
    continue;
  }
  const start=record.project.details.indexOf(`<strong class="main-title">${section}</strong>`);
  if(start<0)throw new Error(`Missing example section: ${section}`);
  const end=record.project.details.findIndex((block,index)=>index>start&&block.includes('class="main-title"'));
  record.project.details.splice(end<0?record.project.details.length:end,0,window,...(example==='storybook'?[moneyNotes]:[]));
}
const requirements = [
  'Code delivery, reusable components and responsive layout',
  'Color, typography, spacing and radius foundations',
  'Component variants, usage guidelines and handoff documentation',
  'Loading, no data, errors, long text and permission restrictions',
  'Multiple currencies, local formats, keyboard access and RTL',
];
const conciseStorybook = text('Explore component variants, states and themes in Storybook. Change the amount or currency to see the format update.','在 Storybook 中查看组件变体、状态与主题。调整金额或币种，即时查看格式变化。','p');
const conciseMoneyEn = 'MoneyText keeps currency codes and local grouping. Integer minor units drive totals; refunds show principal, fees and remaining debit. Filters and form states cover search, status and validation.';
const conciseMoneyZh = 'MoneyText 保留币种代码和本地分组格式。总额按整数最小单位计算；退款拆分本金、费用与剩余扣款。筛选和表单覆盖搜索、状态与校验。';
const conciseTokensEn = 'Design tokens define color, type, spacing, radius and motion. tokens/tokens.json generates CSS and typed references; light-theme overrides remain in themes.css.';
record.project.details = record.project.details.map(block => block
  .replace(/<p>src\/stories\/ makes component variants reviewable[\s\S]*?<\/p>/, conciseStorybook)
  .replace(/<p data-lc-en="Storybook documents component variants,[\s\S]*?<\/p>/, conciseStorybook)
  .replace(/<p data-lc-en="Explore component variants, states and themes in Storybook\.[^"]*"[\s\S]*?<\/p>/, conciseStorybook)
  .replace(/<p>The Figma ↔ React relationship is documented[\s\S]*?<\/p>/, '')
  .replace(/<p>MoneyText shows ISO currency codes and local grouping\.[\s\S]*?<\/p>/, `<p>${conciseMoneyEn}</p>`)
  .replace(/<p>The drawer separates original debit,[\s\S]*?<\/p>/, '')
  .replace(/<p>The foundation covers semantic colors,[\s\S]*?<\/p>/, `<p>${conciseTokensEn}</p>`)
  .replace(/<p>Deep and light themes share a component contract\.[\s\S]*?<\/p>/, '')
  .replace(/<p>Dark and light modes share component contracts\.[\s\S]*?<\/p>/, ''))
  .filter(Boolean);
const deliverableIcons = {
  components: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',
  tokens: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  storybook: '<path d="M12 5v15M3 4h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5v15h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z"/>',
  states: '<path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6Z"/><path d="M12 8v5m0 3h.01"/>',
  international: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
};
const rows = examples.map(([section, example], index) => {
  const marker = record.project.details.indexOf(`<strong class="main-title">${section}</strong>`);
  record.project.details[marker] = `<strong class="main-title" id="lc-section-${example}">${section}</strong>`;
  const icon = `<svg class="lc-deliverable-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${deliverableIcons[example]}</svg>`;
  const requirement = example === 'storybook' ? text(requirements[index],'组件变体、使用规范与交接文档') : escape(requirements[index]);
  return `<tr><td><a href="#lc-section-${example}" data-lc-index-link>${icon}<span>${escape(section)}</span></a></td><td>${requirement}</td></tr>`;
}).join('');
const matrix = record.project.details.findIndex(block => block.includes('class="delivery-matrix-wrap"'));
if (matrix < 0) throw new Error('Missing deliverable index table.');
record.project.details[matrix] = `<div class="delivery-matrix-wrap" role="region" aria-label="Deliverable index" tabindex="0"><table class="delivery-matrix"><caption>${text('Deliverable index','交付索引')}</caption><thead><tr><th scope="col">Deliverable</th><th scope="col">Role requirement</th></tr></thead><tbody>${rows}</tbody></table></div>`;
await writeFile(file,JSON.stringify(record,null,2)+'\n');
console.log('Updated the visual design system, theme diagram, refund/state visuals and five interactive example windows.');
