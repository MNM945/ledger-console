import {createContext,useContext,useEffect,useRef,useState,type CSSProperties} from 'react';
import {createRoot} from 'react-dom/client';
import {I18nProvider,intlLocale,type Locale} from '../i18n';
import {Button,Input,Select} from '../components/Controls';
import {MoneyText} from '../components/MoneyText';
import {StatusBadge} from '../components/StatusBadge';
import {FilterBar,type FilterState} from '../components/FilterBar';
import {TransactionTable,type SortState} from '../components/TransactionTable';
import {TransactionDrawer} from '../components/TransactionDrawer';
import {EmptyState,ErrorState,LoadingSkeleton} from '../components/StateViews';
import {transactions,ALL_CURRENCIES,type Transaction} from '../data/transactions';
import {longTextTransactions} from '../data/api';
import {compareMoney} from '../money';
import sourceDocs from './docs.generated.json';
import {DesignSystem} from './DesignSystem';
import '../styles/tokens.css';
import '../styles/themes.css';
import '../styles/global.css';
import './styles.css';

type ArticleLanguage='en'|'zh';
const CopyContext=createContext<ArticleLanguage>('en');
function useCopy(){const lang=useContext(CopyContext);return(en:string,zh:string)=>lang==='zh'?zh:en;}
const titles:Record<string,[string,string]>={system:['Design system','设计系统'],components:['Components and responsive layout','组件与响应式布局'],tokens:['Design-token playground','设计令牌调整'],money:['Money, filters and forms','金额、筛选与表单'],states:['Boundary states and recovery','边界状态与恢复'],international:['Currency, locale and keyboard access','币种、本地格式与键盘操作'],handoff:['Read, review and hand off','阅读、核验与交接']};
const defaults:FilterState={query:'',currency:'all',statuses:[]};

function Rows({rows,onClear}:{rows:Transaction[];onClear?:()=>void}){
  const [sort,setSort]=useState<SortState>({key:'createdAt',direction:'desc'});
  const [selected,setSelected]=useState<Transaction|null>(null);
  const trigger=useRef<HTMLElement|null>(null);
  const c=useCopy();
  const sorted=[...rows].sort((a,b)=>(sort.key==='amount'?compareMoney(a,b):a[sort.key].localeCompare(b[sort.key]))*(sort.direction==='asc'?1:-1));
  if(!rows.length)return <EmptyState variant="no-results" onClearFilters={onClear}/>;
  return <><div className="table-scroll" role="region" tabIndex={0} aria-label={c('Interactive transaction table','交互式交易表格')}><TransactionTable transactions={sorted} sort={sort} onSortChange={setSort} onRowOpen={(tx,element)=>{trigger.current=element;setSelected(tx);}}/></div>{selected&&<TransactionDrawer transaction={selected} returnFocusRef={trigger} onClose={()=>setSelected(null)}/>}</>;
}

function Components({theme,onThemeToggle}:{theme:'light'|'dark';onThemeToggle:()=>void}){
  const c=useCopy();const[compact,setCompact]=useState(false);const[count,setCount]=useState(3);
  return <>
    <section className="example-component-panel" aria-labelledby="component-example-title">
      <header className="example-header example-component-header"><div><span>LEDGER / LIVE EXAMPLE</span><h1 id="component-example-title">{c(...titles.components)}</h1></div><Button onClick={onThemeToggle} aria-pressed={theme==='dark'}>{theme==='light'?c('Dark','深色'):c('Light','浅色')}</Button></header>
      <p className="example-help">{c('Change the container width, sort a column, then open a row. These are the same table and drawer used by the ledger.','切换容器宽度、排序列，再打开交易行。这里使用的表格与抽屉和账本页面相同。')}</p>
      <div className="example-controls"><Button onClick={()=>setCompact(!compact)} aria-pressed={compact}>{compact?c('Use full width','使用完整宽度'):c('Try compact layout','试用窄屏布局')}</Button><label>{c('Visible records','显示记录数')}<Select aria-label={c('Visible records','显示记录数')} value={count} onValueChange={value=>setCount(Number(value))}><option value={3}>3</option><option value={6}>6</option></Select></label></div>
    </section>
    <div className="example-container" style={{maxWidth:compact?360:undefined}}><div className="example-card"><div><span>{c('Shared component composition','共享组件组合')}</span><strong><MoneyText amount={134.76} currency="EUR"/></strong></div><StatusBadge status="settled"/></div><Rows rows={transactions.slice(0,count)}/></div>
  </>;
}

function Tokens(){
  const c=useCopy();const[color,setColor]=useState('#008b80');const[radius,setRadius]=useState(16);const[space,setSpace]=useState(20);const[count,setCount]=useState(0);
  const style={'--lc-color-interactive-primary':color,'--lc-color-interactive-primary-hover':'var(--lc-color-interactive-primary)','--lc-radius-lg':`${radius}px`,'--lc-space-4':`${space}px`} as CSSProperties;
  const codeRows = [
    {value:`--lc-color-interactive-primary: ${color};`,comment:'primary action color'},
    {value:`--lc-radius-lg: ${radius}px;`,comment:'large component corner radius'},
    {value:`--lc-space-4: ${space}px;`,comment:'spacing unit used by the card'},
  ];
  const codeColumn = Math.max(...codeRows.map(row=>row.value.length)) + 3;
  return <>
    <p className="example-help">{c('Adjust local token overrides. The source JSON is unchanged; the same preview button and card update immediately.','调整本地令牌覆盖值，按钮与卡片即时更新；不会修改源 JSON。')}</p>
    <div className="example-token-controls">
      <label>{c('Primary color','主色')}<input type="color" value={color} onChange={e=>setColor(e.target.value)}/></label>
      <label>{c('Radius','圆角')} {radius}px <span className="range-hint">{c('(0–32px)','（0–32px）')}</span><input type="range" min={0} max={32} value={radius} onChange={e=>setRadius(Number(e.target.value))}/></label>
      <label>{c('Spacing','间距')} {space}px <span className="range-hint">{c('(8–40px)','（8–40px）')}</span><input type="range" min={8} max={40} value={space} onChange={e=>setSpace(Number(e.target.value))}/></label>
    </div>
    <div className="token-preview" style={style}><StatusBadge status="settled"/><h3>{c('A reusable financial card','可复用的金融卡片')}</h3><MoneyText amount={1284.5} fee={14.9} currency="GBP" showBreakdown/><Button className="btn btn--primary" style={{color:'#fff',borderRadius:'var(--lc-radius-lg)'}} onClick={()=>setCount(count+1)}>{c('Test action','测试操作')} · {count}</Button></div>
    <pre className="token-code" tabIndex={0} aria-label={c('Token CSS with comments','带注释的令牌 CSS')}><code>{codeRows.map((row,index)=><span key={index}>{row.value.padEnd(codeColumn)}<span className="token-code-comment">{`/* ${row.comment} */`}</span>{index<codeRows.length-1?'\n':''}</span>)}</code></pre>
    <Button onClick={()=>{setColor('#008b80');setRadius(16);setSpace(20);setCount(0);}}>{c('Reset preview','重置预览')}</Button>
  </>;
}

function MoneyAndFilters(){
  const c=useCopy();const[amount,setAmount]=useState('134.76');const[fee,setFee]=useState('2.15');const[currency,setCurrency]=useState('EUR');const[filters,setFilters]=useState<FilterState>(defaults);
  const valid=(value:string)=>/^\d+(\.\d{1,2})?$/.test(value)&&Number(value)<=1000000;
  const rows=transactions.filter(tx=>(filters.currency==='all'||tx.currency===filters.currency)&&(!filters.statuses.length||filters.statuses.includes(tx.status))&&`${tx.counterparty} ${tx.reference}`.toLowerCase().includes(filters.query.trim().toLowerCase()));
  return <><p className="example-help">{c('Edit amount and fee to preview integer-unit totals. Then search, filter or sort the fixture records. No payment is created.','编辑金额与费用，预览按整数最小单位计算的总额；再搜索、筛选或排序记录。不创建支付。')}</p><div className="example-form-grid"><label htmlFor="sample-amount">{c('Amount','金额')}<Input id="sample-amount" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} aria-invalid={!valid(amount)} aria-describedby={!valid(amount)?'sample-money-error':undefined}/></label><label htmlFor="sample-fee">{c('Fee','费用')}<Input id="sample-fee" inputMode="decimal" value={fee} onChange={e=>setFee(e.target.value)} aria-invalid={!valid(fee)} aria-describedby={!valid(fee)?'sample-money-error':undefined}/></label><label>{c('Currency','币种')}<Select aria-label={c('Currency','币种')} value={currency} onValueChange={setCurrency}>{ALL_CURRENCIES.map(code=><option key={code}>{code}</option>)}</Select></label></div>{(!valid(amount)||!valid(fee))&&<p id="sample-money-error" role="alert" className="field__error">{c('Enter 0–1,000,000 with up to two decimal places.','请输入 0–1,000,000 范围内、最多两位小数的数值。')}</p>}<div className="example-card"><span>{c('Total (principal + fee)','总额（本金＋费用）')}</span><MoneyText amount={valid(amount)?Number(amount):NaN} fee={valid(fee)?Number(fee):NaN} currency={currency} showBreakdown/></div><FilterBar value={filters} onChange={setFilters}/><p role="status">{c('Matched records','匹配记录')}：{rows.length}</p>{rows.length?<Rows rows={rows.slice(0,5)}/>:<EmptyState variant="no-results" onClearFilters={()=>setFilters(defaults)}/>}</>;
}

function States(){
  const c=useCopy();const[state,setState]=useState('ready');const[filters,setFilters]=useState<FilterState>(defaults);
  const states=[['ready','Normal','正常'],['loading','Loading','加载'],['no-data','No transactions','无交易'],['no-results','No filter matches','筛选无匹配'],['network','Network error','网络错误'],['forbidden','Permission denied','权限不足'],['expired','Session expired','会话过期'],['long-text','Long text','长文本']];
  return <><p className="example-help">{c('Choose a state, then use its recovery action. Loading is held until you choose another state; access/session actions only restore this local example.','选择状态并试用恢复操作。加载保持到你切换其他状态；权限和会话操作只恢复本地示例。')}</p><label className="example-state-picker">{c('State','状态')}<Select aria-label={c('State','状态')} value={state} onValueChange={setState}>{states.map(([value,en,zh])=><option key={value} value={value}>{c(en,zh)}</option>)}</Select></label>
  {state==='loading'?<LoadingSkeleton rows={4}/>:state==='no-data'?<EmptyState variant="no-data"/>:state==='no-results'?<EmptyState variant="no-results" onClearFilters={()=>{setFilters(defaults);setState('ready');}}/>:state==='network'||state==='forbidden'||state==='expired'?<ErrorState kind={state} onRetry={()=>setState('ready')}/>:<><FilterBar value={filters} onChange={setFilters}/><Rows onClear={()=>setFilters(defaults)} rows={(state==='long-text'?longTextTransactions:transactions).filter(tx=>(!filters.statuses.length||filters.statuses.includes(tx.status))&&(filters.currency==='all'||tx.currency===filters.currency)&&`${tx.counterparty} ${tx.reference}`.toLowerCase().includes(filters.query.toLowerCase())).slice(0,3)}/></>}
  <p className="example-help" role="status">{c('Current local state','当前本地状态')}：{c(states.find(s=>s[0]===state)![1],states.find(s=>s[0]===state)![2])}</p></>;
}

function International({locale,setLocale}:{locale:Locale;setLocale:(locale:Locale)=>void}){
  const c=useCopy();const[currency,setCurrency]=useState('GBP');const[amount,setAmount]=useState('1284.5');
  return <><p className="example-help">{c('Switch locale and currency to compare formatting and text direction.','切换语言与币种，比较本地格式和文字方向。')}</p><div className="example-form-grid"><label>{c('UI locale','界面语言')}<Select aria-label={c('UI locale','界面语言')} value={locale} onValueChange={value=>setLocale(value as Locale)}><option value="en">English</option><option value="zh">简体中文</option><option value="ar">العربية / RTL</option></Select></label><label>{c('Currency','币种')}<Select aria-label={c('Currency','币种')} value={currency} onValueChange={setCurrency}>{[...ALL_CURRENCIES,'JPY','KWD'].map(code=><option key={code}>{code}</option>)}</Select></label><label>{c('Value','数值')}<Input value={amount} onChange={e=>setAmount(e.target.value)} inputMode="decimal"/></label></div><div className="example-card"><MoneyText amount={amount.trim()?Number(amount):NaN} currency={currency}/><StatusBadge status="processing"/></div><p><time dateTime="2026-10-15T09:30:00Z">{new Intl.DateTimeFormat(intlLocale(locale),{dateStyle:'medium',timeStyle:'short',timeZone:'UTC'}).format(new Date('2026-10-15T09:30:00Z'))} UTC</time></p><p className="example-help">{c('Direction','文字方向')}：<bdi>{locale==='ar'?'RTL':'LTR'}</bdi> · {c('Currency-specific decimals; no conversion.','按币种显示小数位，不进行汇率换算。')}</p></>;
}

function Handoff(){
  const c=useCopy();const[file,setFile]=useState<keyof typeof sourceDocs>('README.md');const[checked,setChecked]=useState<string[]>([]);const[feedback,setFeedback]=useState('');
  const tasks=[['source','Read component entry points','阅读组件入口'],['money','Verify money and refund rules','核验金额与退款规则'],['states','Exercise keyboard and recovery states','操作键盘与恢复状态'],['limits','Review limits before production','生产使用前审阅限制']];
  function download(){const content=`Ledger Console handoff\n${tasks.map(([id,en,zh])=>`${checked.includes(id)?'[x]':'[ ]'} ${c(en,zh)}`).join('\n')}\n\n${file}\n${sourceDocs[file]}`;const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ledger-handoff.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  return <><p className="example-help">{c('Browse actual repository documents, copy a run command and download a local handoff checklist. Nothing is submitted or published.','浏览仓库中的真实文档、复制启动命令，并下载本地交接清单。不提交或发布任何内容。')}</p><label>{c('Source document','源文档')}<Select aria-label={c('Source document','源文档')} value={file} onValueChange={value=>setFile(value as keyof typeof sourceDocs)}>{Object.keys(sourceDocs).map(path=><option key={path}>{path}</option>)}</Select></label><pre className="example-document" tabIndex={0} aria-label={c('English source document','英文源文档')}>{sourceDocs[file]}</pre><div className="example-controls"><Button onClick={async()=>{try{await navigator.clipboard.writeText('npm run dev');setFeedback(c('Copied: npm run dev','已复制：npm run dev'));}catch{setFeedback(c('Copy this command: npm run dev','请复制此命令：npm run dev'));}}}>{c('Copy run command','复制启动命令')}</Button><Button onClick={download}>{c('Download handoff','下载交接清单')}</Button></div><div className="example-checklist">{tasks.map(([id,en,zh])=><label key={id}><input type="checkbox" checked={checked.includes(id)} onChange={()=>setChecked(checked.includes(id)?checked.filter(item=>item!==id):[...checked,id])}/>{c(en,zh)}</label>)}</div><p role="status">{checked.length}/4 · {feedback}</p></>;
}

function App(){
  const params=new URLSearchParams(location.search);const example=params.get('example')||'components';const initial=params.get('lang')==='zh'?'zh':'en';
  const[language,setLanguage]=useState<ArticleLanguage>(initial);const[locale,setLocale]=useState<Locale>(initial);const[theme,setTheme]=useState<'light'|'dark'>('light');
  useEffect(()=>{function receive(event:MessageEvent){if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='ledger-example-language'||!['en','zh'].includes(event.data.locale))return;setLanguage(event.data.locale);setLocale(event.data.locale);}addEventListener('message',receive);if(parent!==window)parent.postMessage({type:'ledger-example-ready'},location.origin);return()=>removeEventListener('message',receive);},[]);
  useEffect(()=>{document.documentElement.lang=locale==='zh'?'zh-Hans':locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';document.documentElement.dataset.theme=theme;},[locale,theme]);
  const isComponents=example==='components'||!titles[example];
  const labels=titles[example]||titles.components;const label=labels[language==='zh'?1:0];
  return <CopyContext.Provider value={language}><I18nProvider locale={locale}>{!isComponents&&<header className="example-header"><div><span>{example==='system'?'LEDGER / DESIGN SYSTEM':'LEDGER / LIVE EXAMPLE'}</span><h1>{label}</h1></div><Button onClick={()=>setTheme(theme==='light'?'dark':'light')} aria-pressed={theme==='dark'}>{language==='zh'?(theme==='light'?'深色':'浅色'):(theme==='light'?'Dark':'Light')}</Button></header>}<main className="example-main">{example==='system'?<DesignSystem theme={theme} onThemeToggle={()=>setTheme(theme==='light'?'dark':'light')} onLocaleChange={setLocale}/>:example==='tokens'?<Tokens/>:example==='money'?<MoneyAndFilters/>:example==='states'?<States/>:example==='international'?<International locale={locale} setLocale={setLocale}/>:example==='handoff'?<Handoff/>:<Components theme={theme} onThemeToggle={()=>setTheme(theme==='light'?'dark':'light')}/>}</main></I18nProvider></CopyContext.Provider>;
}
createRoot(document.getElementById('root')!).render(<App/>);
