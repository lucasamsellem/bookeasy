'use client';

import BookingCard from '@/components/BookingCard';
import useFetchBookings from '@/hooks/useFetchBookings';
import { getLoggedUser } from '@/utils/utils';

export default function AppointmentsPage() {
  const loggedUser = getLoggedUser();

  const { bookings } = useFetchBookings();

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
