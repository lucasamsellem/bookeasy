// components/Select.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SelectProps<T extends string> {
  value: T | '';
  onChange: (value: T | '') => void;
  options: { label: string; value: T }[];
  placeholder?: string;
}

export default function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder = 'Tous',
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Fermer si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className='relative w-full'>
      {/* Trigger */}
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        className='w-full h-10 px-3 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <ul className='absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden'>
          {/* Option "Tous" */}
          <li>
            <button
              type='button'
              onClick={() => {
                onChange('' as T | '');
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm transition hover:bg-slate-50
                ${value === '' ? 'font-semibold text-slate-800' : 'text-gray-400'}`}
            >
              {placeholder}
            </button>
          </li>

          {options.map((o) => (
            <li key={o.value}>
              <button
                type='button'
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm transition hover:bg-slate-50
                  ${value === o.value ? 'font-semibold text-slate-800 bg-slate-50' : 'text-gray-600'}`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
