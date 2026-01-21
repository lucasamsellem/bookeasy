'use client';

import BookingCard from '@/components/BookingCard';
import { apiFetch } from '@/services/api';
import { getLoggedUser } from '@/utils/utils';
import { Booking } from '@backend/controllers/booking.controller';
import { useQuery } from '@tanstack/react-query';

export default function AppointmentsPage() {
  const loggedUser = getLoggedUser();

  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => apiFetch<Booking[]>('/bookings'),
  });

  return (
    <div>
      <h2>
        Appointments booked by {loggedUser?.firstName} {loggedUser?.lastName}
      </h2>

      <ul>
        {bookings?.map((booking) => (
          <li key={booking.id}>
            <BookingCard booking={booking} />
          </li>
        ))}
      </ul>
    </div>
  );
}
