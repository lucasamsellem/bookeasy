'use client';

import { apiFetch } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { type Booking } from '@backend/controllers/booking.controller';
import { User } from '@backend/controllers/user.controller';

export default function DashboardPage() {
  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => apiFetch<Booking[]>('/bookings'),
  });

  const { data: professionals } = useQuery({
    queryKey: ['professionals'],
    queryFn: () => apiFetch<User[]>('/customers/professionals'),
  });

  const getProfessional = (professionalId: number) => {
    return professionals?.find((p) => p.id === professionalId);
  };

  return (
    <section>
      <h2>Your bookings</h2>
      <ul>
        {bookings?.map((booking) => (
          <li key={booking.id}>
            <span>{getProfessional(booking.professionalId)?.firstName}</span>
            <span>{getProfessional(booking.professionalId)?.lastName}</span>
            <span>{booking.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
