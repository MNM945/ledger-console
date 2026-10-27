import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes } from 'react';
export { Select } from './Select';

/** Figma Button 22:25906 / 22:26058, translated to semantic native controls. */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { loading?: boolean; }
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type = 'button', className = '', disabled, loading = false, children, ...props }, ref) => <button {...props} type={type} className={Array.from(new Set(['btn', ...className.split(/\s+/).filter(Boolean)])).join(' ')} disabled={disabled || loading} aria-busy={loading || props['aria-busy']} ref={ref}>{loading && <svg className="btn__spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="9" opacity=".25"/><path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round"/></svg>}{children}</button>,
);
Button.displayName = 'Button';

/** Figma Default Input 22:26741; width adapts to the ledger layout. */
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`field__input ${props.className ?? ''}`} />;
}
