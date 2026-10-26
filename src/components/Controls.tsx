import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes } from 'react';
export { Select } from './Select';

/** Figma Button 22:25906 / 22:26058, translated to semantic native controls. */
export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ type = 'button', className = 'btn', ...props }, ref) => <button {...props} type={type} className={className} ref={ref} />,
);
Button.displayName = 'Button';

/** Figma Default Input 22:26741; width adapts to the ledger layout. */
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`field__input ${props.className ?? ''}`} />;
}
