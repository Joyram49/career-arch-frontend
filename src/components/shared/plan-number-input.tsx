// src/components/shared/plan-number-input.tsx
'use client';

import { Input } from '@ui/input';
import { useState } from 'react';

interface PlanNumberInputProps {
  id?: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Allow a fractional part while typing (e.g. price in dollars). Defaults to integer parsing. */
  allowDecimal?: boolean;
  /** When true, clearing the field yields `undefined` (for optional numeric fields like salary min/max).
   *  When false (default), clearing reverts to the last valid value on blur (for required fields like vacancies). */
  allowEmpty?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Plain `<input type="number" value={someNumber}>` bound directly to a numeric
// field has a well-known React quirk: once the value is 0, clearing the field
// snaps straight back to "0" (since `'' || '0'` style fallbacks coerce empty
// text to 0), so the "0" never actually leaves the DOM and new digits get
// typed *next to* it ("02", "020", ...) instead of replacing it.
//
// Fix: keep the on-screen text as local state, independent from the numeric
// value. Empty/partial text ("", "-", "12.") is allowed to exist
// transiently. We push a parsed number up on every valid keystroke, and only
// *pull* the external value back down when it actually diverges from what's
// typed (i.e. on plan switch / external reset) — never mid-keystroke.
export function PlanNumberInput({
  id,
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  allowDecimal = false,
  allowEmpty = false,
  placeholder,
  className,
}: PlanNumberInputProps): React.JSX.Element {
  const parse = (text: string): number => (allowDecimal ? parseFloat(text) : parseInt(text, 10));
  const isPartial = (text: string): boolean =>
    text === '' || text === '-' || (allowDecimal && (text.endsWith('.') || text === '-.'));

  const [raw, setRaw] = useState(value === undefined ? '' : String(value));
  // Track the last external `value` we've synced from, so we can tell a
  // genuine prop change (switch plans / external reset) apart from the
  // value simply reflecting what the user just typed. Adjusting state
  // during render (rather than in a useEffect) avoids an extra render pass.
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    const currentParsed = isPartial(raw) ? undefined : parse(raw);
    if (currentParsed !== value) setRaw(value === undefined ? '' : String(value));
  }

  return (
    <Input
      id={id}
      type="number"
      min={min}
      max={max}
      step={step}
      value={raw}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => {
        const next = e.target.value;
        setRaw(next);

        if (next === '' && allowEmpty) {
          onChange(undefined);
          return;
        }
        if (isPartial(next)) return; // let the user keep typing

        const parsed = parse(next);
        if (!Number.isNaN(parsed)) onChange(parsed);
      }}
      onBlur={() => {
        if (raw === '' && allowEmpty) {
          onChange(undefined);
          return;
        }
        const parsed = parse(raw);
        if (isPartial(raw) || Number.isNaN(parsed)) {
          setRaw(value === undefined ? '' : String(value)); // nothing valid was entered — revert to last known value
          return;
        }
        setRaw(String(parsed)); // normalize "02" -> "2", "5." -> "5", etc.
        if (parsed !== value) onChange(parsed);
      }}
      className={className}
    />
  );
}
