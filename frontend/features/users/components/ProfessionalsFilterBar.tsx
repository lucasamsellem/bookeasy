'use client';

import { User } from '@backend/controllers/user.controller';
import { useMemo } from 'react';
import Select from '../../../components/Select';
import './ProfessionalsFilterBar.scss';

type Props = {
  professionals?: User[];
  filters: {
    profession: string | null;
    name: string;
    location: string;
  };
  onChange: (filters: Props['filters']) => void;
};

export default function ProfessionalsFilterBar({ professionals, filters, onChange }: Props) {
  const professionOptions = useMemo(() => {
    if (!professionals) return [];
    return Array.from(new Set(professionals.map((p) => p.profession).filter(Boolean)));
  }, [professionals]);

  const locationOptions = useMemo(() => {
    if (!professionals) return [];
    return Array.from(new Set(professionals.map((p) => p.city).filter(Boolean)));
  }, [professionals]);

  const update = (key: keyof Props['filters'], value: string) => {
    onChange({
      ...filters,
      [key]: value || '',
    });
  };

  return (
    <div className='filter-bar-wrapper'>
      <div className='filter-bar'>
        <FilterItem label='Profession'>
          <Select
            value={filters.profession ?? ''}
            onChange={(v) => onChange({ ...filters, profession: v || null })}
            options={professionOptions.map((p) => ({ label: p!, value: p! }))}
            placeholder='Toutes'
          />
        </FilterItem>

        <FilterItem label='Nom'>
          <input
            type='text'
            placeholder='Chercher par nom'
            value={filters.name}
            onChange={(e) => update('name', e.target.value)}
            className='filter-bar__input'
          />
        </FilterItem>

        <FilterItem label='Ville'>
          <Select
            value={filters.location}
            onChange={(v) => update('location', v)}
            options={locationOptions.map((l) => ({ label: l!, value: l! }))}
            placeholder='Toutes'
          />
        </FilterItem>
      </div>
    </div>
  );
}

function FilterItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='filter-bar__item'>
      <label className='filter-bar__label'>{label}</label>
      {children}
    </div>
  );
}
