'use client';

import { User } from '@backend/controllers/user.controller';
import { useMemo } from 'react';

type Props = {
  professionals?: User[];
  filters: {
    profession: string | null;
    name: string;
    location: string;
    // date: string;
  };
  onChange: (filters: Props['filters']) => void;
};

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
    <div className='w-full flex justify-center'>
      <div
        className='
          flex items-center
          bg-white
          rounded-full
          shadow-md
          border
          divide-x
          overflow-hidden
        '
      >
        {/* Profession */}
        <div className='px-6 py-3 flex flex-col'>
          <label className='text-xs font-semibold'>Profession</label>
          <select
            value={filters.profession ?? ''}
            onChange={(e) => onChange({ ...filters, profession: e.target.value || null })}
            className='bg-transparent text-sm focus:outline-none cursor-pointer'
          >
            <option value=''>All</option>
            {professionOptions.map((profession) => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className='px-6 py-3 flex flex-col'>
          <label className='text-xs font-semibold'>Name</label>
          <input
            type='text'
            placeholder='Search name'
            value={filters.name}
            onChange={(e) => update('name', e.target.value)}
            className='bg-transparent text-sm focus:outline-none'
          />
        </div>

        {/* Location */}
        <div className='px-6 py-3 flex flex-col'>
          <label className='text-xs font-semibold'>Location</label>
          <input
            type='text'
            placeholder='City'
            value={filters.location}
            onChange={(e) => update('location', e.target.value)}
            className='bg-transparent text-sm focus:outline-none'
          />
        </div>

        {/* Date */}
        {/* <div className='px-6 py-3 flex flex-col'>
          <label className='text-xs font-semibold'>Available on</label>
          <input
            type='date'
            value={filters.date}
            onChange={(e) => update('date', e.target.value)}
            className='bg-transparent text-sm focus:outline-none'
          />
        </div> */}
      </div>
    </div>
  );
}
