/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';

import { useState } from 'react';

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  maxSkills?: number;
}

export function SkillsInput({
  value,
  onChange,
  placeholder = 'Type a skill and press Enter…',
  maxSkills = 20,
}: SkillsInputProps): React.JSX.Element {
  const [input, setInput] = useState('');

  function addSkill(): void {
    const trimmed = input.trim();
    if (!trimmed || value.length >= maxSkills) {
      setInput('');
      return;
    }
    if (value.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setInput('');
      return;
    }
    onChange([...value, trimmed]);
    setInput('');
  }

  function removeSkill(skill: string): void {
    onChange(value.filter((s) => s !== skill));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      removeSkill(value[value.length - 1]!);
    }
  }

  return (
    <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-border bg-input px-2 py-1.5 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
      {value.map((skill) => (
        <span
          key={skill}
          className="flex items-center gap-1 rounded-full bg-brand-sky/10 px-2.5 py-1 text-xs font-medium text-brand-sky"
        >
          {skill}
          <button
            type="button"
            onClick={() => removeSkill(skill)}
            aria-label={`Remove ${skill}`}
            className="hover:text-brand-sky-dark"
          >
            <i className="ti ti-x text-[11px]" aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addSkill}
        placeholder={value.length === 0 ? placeholder : ''}
        className="min-w-32 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
}
