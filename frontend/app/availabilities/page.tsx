'use client';

import ProfessionalsList from '@/components/ProfessionalsList';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { User } from '@backend/controllers/user.controller';

// const mockAvailabilities: Availability[] = [
//   {
//     id: 1,
//     date: '2025-01-10',
//     startTime: '09:00',
//     endTime: '10:00',
//     isAvailable: true,
//   },
//   {
//     id: 2,
//     date: '2025-01-10',
//     startTime: '10:00',
//     endTime: '11:00',
//     isAvailable: false,
//   },
// ];

export default function AvailabilitiesPage() {
  const { data: professionals } = useQuery<User[]>({
    queryKey: ['professionals'],
    queryFn: () => apiFetch('/customers/professionals'),
  });

  return (
    <section>
      <h2>Professionals registered on BookEasy</h2>
      <ProfessionalsList professionals={professionals} />
    </section>
  );
}
