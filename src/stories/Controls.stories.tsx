import { useId, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Input, Select } from '../components/Controls';

function ReferenceForm({ disabled = false }: { disabled?: boolean }) {
  const id = useId();
  const [reference, setReference] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const invalid = submitted && reference.trim().length === 0;
  return <form noValidate style={{ maxInlineSize: 420, display: 'grid', gap: 16 }} onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
    <div className="field"><label className="field__label" htmlFor={`${id}-reference`}>Reference (required)</label>
      <Input id={`${id}-reference`} value={reference} onChange={event => { setReference(event.target.value); setSubmitted(false); }} disabled={disabled} required aria-invalid={invalid || undefined} aria-describedby={`${id}-help${invalid ? ` ${id}-error` : ''}`} placeholder="Enter a fictional reference" />
      <p id={`${id}-help`}>Component example only. Nothing is sent or saved.</p>
      {invalid && <p id={`${id}-error`} className="field__error" role="alert">Enter a reference before previewing.</p>}
    </div>
    <div className="field"><label className="field__label" htmlFor={`${id}-currency`}>Currency</label><Select id={`${id}-currency`} disabled={disabled}><option>GBP</option><option>USD</option><option>HKD</option></Select></div>
    <Button className="btn btn--primary" type="submit" disabled={disabled}>Preview reference</Button>
    {submitted && !invalid && <p role="status">Reference accepted for this local example: <bdi style={{ overflowWrap: 'anywhere' }}>{reference.trim()}</bdi></p>}
  </form>;
}
const meta = {
  title: 'Components/Controls',
  component: ReferenceForm,
  parameters: { docs: { description: { component: 'Native Button and Input with a Figma-based Select. The combobox supports arrow keys, Home/End, typeahead, Enter, Escape and Tab; its viewport-bounded listbox uses the reference pill and rounded option panel. Submit the empty reference to inspect input validation. No payment or refund instruction is created.' } } },
} satisfies Meta<typeof ReferenceForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FormAndValidation: Story = {};
export const Disabled: Story = { args: { disabled: true } };
