'use client';

import { useState, type InputHTMLAttributes } from 'react';

type NumericInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'min' | 'max'> & {
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
};

/**
 * Integer input that lets the visitor clear the field and retype freely.
 * Only in-range values are committed; on blur the field snaps back to the last valid value.
 */
export function NumericInput({ value, min, max, onValueChange, onBlur, ...rest }: NumericInputProps) {
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <input
      {...rest}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={draft ?? String(value)}
      onChange={(e) => {
        const raw = e.target.value;
        setDraft(raw);
        const next = Number(raw);
        if (raw !== '' && Number.isInteger(next) && next >= min && next <= max) onValueChange(next);
      }}
      onBlur={(e) => {
        setDraft(null);
        onBlur?.(e);
      }}
    />
  );
}
