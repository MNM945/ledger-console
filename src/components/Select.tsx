import {Children, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState, type AriaAttributes, type CSSProperties, type KeyboardEvent, type OptionHTMLAttributes, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import chevronDown from '../assets/figma/chevron-down.svg';
import chevronUp from '../assets/figma/chevron-up.svg';

interface SelectProps extends AriaAttributes {
  id?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  children: ReactNode;
  onValueChange?: (value: string) => void;
}

/** Figma Select 22:26860 / 22:26875 and SelectOption 22:26893–26902. */
export function Select({id, name, className = '', disabled, value, defaultValue, children, onValueChange, ...aria}: SelectProps) {
  const generatedId = useId();
  const triggerId = id ?? `select-${generatedId}`;
  const listId = `${triggerId}-options`;
  const options = Children.toArray(children).flatMap(child => {
    if (!isValidElement<OptionHTMLAttributes<HTMLOptionElement>>(child)) return [];
    return [{value: String(child.props.value ?? child.props.children), label: child.props.children, disabled: Boolean(child.props.disabled)}];
  });
  const [localValue, setLocalValue] = useState(String(defaultValue ?? options[0]?.value ?? ''));
  const currentValue = String(value ?? localValue);
  const selected = options.findIndex(option => option.value === currentValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<CSSProperties>({});
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const typeahead = useRef({query: '', at: 0});
  const enabled = options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);

  function show(index = selected) {
    if (disabled || !enabled.length) return;
    setActive(enabled.includes(index) ? index : enabled[0]);
    setOpen(true);
  }
  function choose(index: number) {
    if (!options[index] || options[index].disabled) return;
    setLocalValue(options[index].value);
    onValueChange?.(options[index].value);
    setOpen(false);
    trigger.current?.focus();
  }
  function handleKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        show(event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1] : selected);
        return;
      }
      const index = enabled.indexOf(active);
      setActive(event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1] : enabled[Math.max(0, Math.min(enabled.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (open) choose(active); else show();
    } else if (event.key === 'Escape') {
      if (open) {event.preventDefault(); event.stopPropagation(); setOpen(false);}
    } else if (event.key === 'Tab') {
      setOpen(false);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const query = (now - typeahead.current.at < 700 ? typeahead.current.query : '') + event.key.toLocaleLowerCase();
      typeahead.current = {query, at: now};
      const match = enabled.find(index => String(options[index].label).toLocaleLowerCase().startsWith(query));
      if (match !== undefined) {setActive(match); if (!open) show(match);}
    }
  }

  useLayoutEffect(() => {
    if (!open || !trigger.current) return;
    function place() {
      const rect = trigger.current!.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom - 12;
      const above = rect.top - 12;
      const height = Math.min(options.length * 44 + 8, 352);
      const upward = below < Math.min(height, 220) && above > below;
      const maxHeight = Math.max(44, Math.min(352, upward ? above : below));
      const width = Math.min(Math.max(123, rect.width), window.innerWidth - 16);
      const rtl = getComputedStyle(trigger.current!).direction === 'rtl';
      setPosition({width, maxHeight, left: Math.max(8, Math.min(rtl ? rect.right - width : rect.left, window.innerWidth - width - 8)), top: upward ? Math.max(8, rect.top - 4 - Math.min(height, maxHeight)) : rect.bottom + 4});
    }
    place();
    window.addEventListener('resize', place);
    // Scrolling the option list must not close it; moving its anchor must.
    const onScroll = (event: Event) => {if (!list.current?.contains(event.target as Node)) setOpen(false);};
    window.addEventListener('scroll', onScroll, true);
    const onOutside = (event: PointerEvent) => {
      if (!trigger.current?.contains(event.target as Node) && !list.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onOutside);
    return () => {window.removeEventListener('resize', place); window.removeEventListener('scroll', onScroll, true); document.removeEventListener('pointerdown', onOutside);};
  }, [open, options.length]);

  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({block: 'nearest'});
  }, [open, active, listId]);
  useEffect(() => {if (disabled) setOpen(false);}, [disabled]);

  return <span className="select-control">
    <button {...aria} id={triggerId} ref={trigger} type="button" role="combobox" aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined} aria-activedescendant={open ? `${listId}-${active}` : undefined} disabled={disabled} className={`field__input select-control__trigger ${className}`} onClick={() => open ? setOpen(false) : show()} onKeyDown={handleKey} onBlur={() => setOpen(false)}>
      <span className="select-control__value">{options[selected]?.label ?? options[0]?.label}</span>
      <img src={open ? chevronUp : chevronDown} alt="" width="24" height="24" aria-hidden="true"/>
    </button>
    {name && <input type="hidden" name={name} value={currentValue} disabled={disabled}/>}
    {open && createPortal(<div ref={list} id={listId} role="listbox" aria-labelledby={triggerId} className="select-control__list" style={position} onPointerDown={event => event.preventDefault()}>
      {options.map((option, index) => <div key={option.value} id={`${listId}-${index}`} role="option" aria-selected={index === selected} aria-disabled={option.disabled || undefined} data-active={index === active} className="select-control__option" onPointerMove={() => {if (!option.disabled) setActive(index);}} onClick={() => choose(index)}>{option.label}</div>)}
    </div>, document.body)}
  </span>;
}
