import {useId, useState} from 'react';
import {Button, Input, Select} from '../components/Controls';
import {useI18n} from '../i18n';
import './interaction-states.css';

const buttonStates = [
  ['default','Default','默认'], ['hover','Hover','悬停'], ['pressed','Pressed','按下'],
  ['focus','Focus','聚焦'], ['disabled','Disabled','禁用'], ['loading','Loading','加载中'],
] as const;
const inputStates = [
  ['default','Default','默认'], ['hover','Hover','悬停'], ['focus','Focus','聚焦'],
  ['filled','Filled','已填写'], ['error','Error','错误'], ['disabled','Disabled','禁用'],
] as const;

export function InteractionStates() {
  const {locale} = useI18n();
  const c = (en: string, zh: string) => locale === 'zh' ? zh : en;
  const id = useId();
  const [clicks, setClicks] = useState(0);
  const [reference, setReference] = useState('');
  const [currency, setCurrency] = useState('GBP');
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && !reference.trim();
  return <div className="control-states">
    {(['primary','secondary'] as const).map(variant => <fieldset className="control-state-group" key={variant}>
      <legend>{variant === 'primary' ? c('Primary button','主要按钮') : c('Secondary button','次要按钮')}</legend>
      <div className="control-state-grid">{buttonStates.map(([state,en,zh]) => <div className="control-state-sample" key={state} data-control-state={`${variant}-${state}`}>
        <Button className={variant === 'primary' ? 'btn--primary' : ''} data-preview-state={state} disabled={state === 'disabled'} loading={state === 'loading'} aria-label={`${c(variant === 'primary' ? 'Primary' : 'Secondary',variant === 'primary' ? '主要按钮' : '次要按钮')} · ${c(en,zh)}`} onClick={() => setClicks(value => value + 1)}>{state === 'loading' ? c('Loading','加载中') : c('Continue','继续')}</Button>
        <small>{c(en,zh)}</small>
      </div>)}</div>
    </fieldset>)}
    <p className="control-state-feedback" role="status">{clicks ? `${c('Button actions','按钮操作')} · ${clicks}` : c('Try click, Tab and Enter.','可试用点击、Tab 与 Enter。')}</p>
    <fieldset className="control-state-group"><legend>{c('Input states','输入框状态')}</legend>
      <div className="control-state-grid control-state-grid--fields">{inputStates.map(([state,en,zh]) => <label className="control-state-sample" key={state} data-control-state={`input-${state}`}>
        <span>{c(en,zh)}</span><Input aria-label={`${c('Reference','参考编号')} · ${c(en,zh)}`} data-preview-state={state} placeholder="PAY-10420" defaultValue={state === 'filled' ? 'PAY-10420' : ''} disabled={state === 'disabled'} aria-invalid={state === 'error' || undefined} aria-describedby={state === 'error' ? `${id}-sample-error` : undefined}/>
        {state === 'error' && <small className="field__error" id={`${id}-sample-error`}>{c('Reference is required.','请填写参考编号。')}</small>}
      </label>)}</div>
    </fieldset>
    <form className="control-state-live" noValidate onSubmit={event => {event.preventDefault();setSubmitted(true);}}>
      <h3>{c('Try the interaction','试用交互')}</h3>
      <div className="control-state-live-fields">
        <label className="field"><span className="field__label">{c('Reference','参考编号')}</span><Input value={reference} onChange={event => {setReference(event.target.value);setSubmitted(false);}} placeholder="PAY-10420" required aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-live-error` : undefined}/></label>
        <label className="field"><span className="field__label">{c('Currency','币种')}</span><Select value={currency} onValueChange={setCurrency}>{['GBP','USD','EUR','HKD','AED','SAR'].map(code => <option key={code}>{code}</option>)}</Select></label>
        <Button className="btn--primary" type="submit">{c('Validate','校验')}</Button>
      </div>
      {invalid ? <p id={`${id}-live-error`} className="field__error" role="alert">{c('Enter a reference before continuing.','继续前请填写参考编号。')}</p> : submitted ? <p className="control-state-feedback" role="status">{c('Ready','校验通过')} · <bdi>{reference.trim()}</bdi> · {currency}</p> : <p className="control-state-feedback">{c('Open the select; use arrows, Enter and Escape.','打开下拉框，试用方向键、Enter 与 Escape。')}</p>}
    </form>
  </div>;
}
