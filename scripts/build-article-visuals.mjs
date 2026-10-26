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

const states = [
  ['Loading','加载中','Rows stay hidden while the loading state is shown.','加载状态显示期间隐藏交易行。','Choose Normal to leave the persistent loading example.','选择正常状态，退出持续加载示例。'],
  ['No transactions','无交易','No records exist in the selected demo dataset.','所选演示数据集中没有记录。','Explain when records will appear; no unnecessary reset action.','说明记录何时出现，不添加多余的重置操作。'],
  ['No filter matches','筛选无匹配','The dataset exists, but the current filters match nothing.','数据存在，但当前筛选未匹配任何记录。','Clear filters to return to the existing records.','清除筛选，返回已有记录。'],
  ['Network error','网络错误','The simulated request fails; no transaction rows are shown.','模拟请求失败，不显示交易行。','Retry restores the local demo and preserves filters.','重试恢复本地演示，并保留筛选。'],
  ['Permission / session','权限／会话','Permission denial and expired session have separate explanations.','权限不足与会话过期分别提供对应说明。','Restore demo access or session locally; no real authentication.','在本地恢复演示访问或会话，不进行真实身份验证。'],
  ['Long text','长文本','All 42 records remain; one name and reference stress the layout.','保留全部 42 条记录，用一个长名称与参考编号测试布局。','Wrap the full identifier; keep the table scrollable.','完整标识符换行，表格保持可滚动。'],
];
const boundaries = `<figure class="lc-article-viz" data-ledger-visual="states" aria-labelledby="lc-viz-states">
${heading('lc-viz-states','Every state has a visible next step','每种状态都有清楚的后续路径','03')}
<div class="lc-state-route">${text('Local request','本地请求','span')}${arrow}${text('Loading','加载中','span')}${arrow}${text('Records or an explained state','记录或有解释的状态','span')}</div>
${text('Open a state to inspect its presentation and recovery rule. These are the demo’s UI contracts, not live service controls.','展开状态，查看呈现方式与恢复规则。这些是演示的界面契约，不是真实服务操作。','p','class="lc-viz-caption"')}
<div class="lc-state-grid">${states.map(([name,zh,body,bodyZh,recovery,recoveryZh])=>`<details class="lc-state-card" open><summary>${text(name,zh)}<span class="lc-state-chevron" aria-hidden="true">＋</span></summary><div>${text(body,bodyZh,'p')}<div class="lc-state-recovery">${text('Next step','后续路径','strong')}${text(recovery,recoveryZh,'p')}</div></div></details>`).join('')}</div>
</figure>`;

record.project.details = record.project.details.filter(block => !block.includes('data-ledger-visual='));
record.project.details = record.project.details.filter(block => !block.includes('data-ledger-example='));
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
  ['Internationalization and accessibility',boundaries],
]) {
  const index = record.project.details.indexOf(`<strong class="main-title">${nextHeading}</strong>`);
  if (index < 0) throw new Error(`Cannot locate article section: ${nextHeading}`);
  record.project.details.splice(index,0,visual);
}
const examples = [
  ['React + TypeScript page and components','components','01','Resize, sort and inspect','切换宽度、排序与查看详情','Change the layout width and open a transaction row.','切换布局宽度，并打开一行交易查看详情。'],
  ['Design tokens','tokens','02','Adjust the design tokens','调整设计令牌','Change color, radius and spacing; test the preview action.','调整颜色、圆角与间距，再点击预览按钮。'],
  ['Storybook and component documentation','storybook','03','Use the actual Storybook catalogue','操作真实 Storybook 组件目录','Choose a story and change its Controls. Storybook tool labels remain English.','选择故事并修改 Controls 参数；Storybook 工具界面保留英文。'],
  ['Boundary-state examples','states','04','Trigger a state and recover','触发状态并恢复','Switch loading, empty, error, permission, session and long-text states.','切换加载、空数据、错误、权限、会话和长文本状态。'],
  ['Internationalization and accessibility','international','05','Try currencies, RTL and keyboard access','试用币种、RTL 与键盘操作','Switch locale and currency, then open and close the drawer using the keyboard.','切换语言与币种，再用键盘打开和关闭详情抽屉。'],
];
for(const [section,example,index,title,titleZh,instruction,instructionZh] of examples){
  const src=example==='storybook'?'projects/ledger-console/storybook/index.html?path=/docs/components-moneytext--docs':`projects/ledger-console/examples.html?example=${example}&lang=en`;
  const label=`Ledger Console interactive example ${index}: ${title}`;
  const labelZh=`Ledger Console 交互示例 ${index}：${titleZh}`;
  const window=`<figure class="lc-example-window" data-ledger-example="${example}" aria-labelledby="lc-example-heading-${example}"><div class="lc-example-caption"><span class="lc-example-number">LIVE ${index}</span>${text(title,titleZh,'h3',`id="lc-example-heading-${example}"`)}${text(instruction,instructionZh,'p')}</div><iframe src="${escape(src)}" title="${escape(label)}" data-lc-title-en="${escape(label)}" data-lc-title-zh="${escape(labelZh)}" data-lc-example="${example}" loading="lazy" allow="clipboard-write"></iframe></figure>`;
  if (example === 'components') {
    const matrix=record.project.details.findIndex(block=>block.includes('class="delivery-matrix-wrap"'));
    if(matrix<0)throw new Error('Missing deliverable index table.');
    record.project.details.splice(matrix,0,window);
    continue;
  }
  const start=record.project.details.indexOf(`<strong class="main-title">${section}</strong>`);
  if(start<0)throw new Error(`Missing example section: ${section}`);
  const end=record.project.details.findIndex((block,index)=>index>start&&block.includes('class="main-title"'));
  record.project.details.splice(end<0?record.project.details.length:end,0,window);
}
const requirements = [
  'Code delivery, reusable components and responsive layout',
  'Color, typography, spacing and radius foundations',
  'Variants, usage rules and documented Figma ↔ React references',
  'Loading, no data, errors, long text and permission restrictions',
  'Multiple currencies, local formats, keyboard access and RTL',
];
const conciseMoneyEn = 'MoneyText keeps currency codes and local grouping. Integer minor units drive totals; refunds show principal, fees and remaining debit. Filters and form states cover search, status and validation.';
const conciseMoneyZh = 'MoneyText 保留币种代码和本地分组格式。总额按整数最小单位计算；退款拆分本金、费用与剩余扣款。筛选和表单覆盖搜索、状态与校验。';
const conciseTokensEn = 'Design tokens define color, type, spacing, radius and motion. tokens/tokens.json generates CSS and typed references; light-theme overrides remain in themes.css.';
record.project.details = record.project.details.map(block => block
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
  return `<tr><td><a href="#lc-section-${example}" data-lc-index-link>${icon}<span>${escape(section)}</span></a></td><td>${escape(requirements[index])}</td></tr>`;
}).join('');
const matrix = record.project.details.findIndex(block => block.includes('class="delivery-matrix-wrap"'));
if (matrix < 0) throw new Error('Missing deliverable index table.');
record.project.details[matrix] = `<div class="delivery-matrix-wrap" role="region" aria-label="Deliverable index" tabindex="0"><table class="delivery-matrix"><caption>${text('Deliverable index','交付索引')}</caption><thead><tr><th scope="col">Deliverable</th><th scope="col">Role requirement</th></tr></thead><tbody>${rows}</tbody></table></div>`;
await writeFile(file,JSON.stringify(record,null,2)+'\n');
console.log('Updated the visual design system, theme diagram, refund/state visuals and five interactive example windows.');
