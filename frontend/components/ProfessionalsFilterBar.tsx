'use client';

import { User } from '@backend/controllers/user.controller';
import { useMemo } from 'react';

type Props = {
  professionals?: User[];
  filters: {
    profession: string | null;
    name: string;
    location: string;
  };
  onChange: (filters: Props['filters']) => void;
};

const INPUT_STYLE =
  'w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white';

export default function ProfessionalsFilterBar({ professionals, filters, onChange }: Props) {
  const professionOptions = useMemo(() => {
    if (!professionals) return [];

    return Array.from(new Set(professionals.map((p) => p.profession).filter(Boolean)));
  }, [professionals]);

  const update = (key: keyof Props['filters'], value: string) => {
    onChange({
      ...filters,
      [key]: value || '',
    });
  };

  return (
    <div className='w-full flex justify-center px-4'>
      <div
        className='
        w-fit max-w-5xl
        bg-white
        shadow-sm
        rounded-2xl
        p-4
        flex flex-col gap-4
        
        md:flex-row
        md:items-end
        md:gap-0
        md:divide-x
        md:rounded-2xl
        md:shadow-md
        md:p-0
        '
      >
        {/* Profession */}
        <FilterItem label='Profession'>
          <select
            value={filters.profession ?? ''}
            onChange={(e) => onChange({ ...filters, profession: e.target.value || null })}
            className='
    w-full
    h-10
    px-3
    rounded-lg
    border border-gray-200
    bg-gray-50
    text-sm text-gray-800
    cursor-pointer
    transition

    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-blue-500
    focus:bg-white
  '
          >
            <option value=''>All</option>
            {professionOptions.map((profession) => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>
        </FilterItem>

        {/* Name */}
        <FilterItem label='Name'>
          <input
            type='text'
            placeholder='Search name'
            value={filters.name}
            onChange={(e) => update('name', e.target.value)}
            className={INPUT_STYLE}
          />
        </FilterItem>

        {/* Location */}
        <FilterItem label='Location'>
          <input
            type='text'
            placeholder='City'
            value={filters.location}
            onChange={(e) => update('location', e.target.value)}
            className={INPUT_STYLE}
          />
        </FilterItem>
      </div>
    </div>
  );
}

function FilterItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col border-none md:px-6 md:py-3'>
      <label className='text-xs font-semibold text-gray-500 mb-1'>{label}</label>

      {children}
    </div>
  );
}
