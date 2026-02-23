'use client';

import ProfessionalsList from '@/components/ProfessionalsList';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { User } from '@backend/controllers/user.controller';
import { useMemo, useState } from 'react';
import ProfessionalsFilterBar from '@/components/ProfessionalsFilterBar';

export default function AvailabilitiesPage() {
  const { data: professionals } = useQuery<User[]>({
    queryKey: ['professionals'],
    queryFn: () => apiFetch('/customers/professionals'),
  });

  const [filters, setFilters] = useState({
    profession: null as string | null,
    name: '',
    location: '',
    // date: '',
  });

  const filteredProfessionals = useMemo(() => {
    if (!professionals) return [];

    return professionals.filter((p) => {
      const matchProfession = !filters.profession || p.profession === filters.profession;

      const matchName =
        !filters.name ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(filters.name.toLowerCase());

      const matchLocation =
        !filters.location || p.city?.toLowerCase().includes(filters.location.toLowerCase());

      // La logique date dépend de ton modèle availability
      const matchDate = true;

      return matchProfession && matchName && matchLocation && matchDate;
    });
  }, [professionals, filters]);

  return (
    <section className='space-y-6'>
      <ProfessionalsFilterBar
        professionals={professionals}
        filters={filters}
        onChange={setFilters}
      />

      <ProfessionalsList professionals={filteredProfessionals} />
    </section>
  );
}
