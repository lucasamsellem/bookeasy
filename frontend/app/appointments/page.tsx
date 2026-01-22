'use client';

import BookingCard from '@/components/BookingCard';
import useFetchBookings from '@/hooks/useFetchBookings';
import { getLoggedUser } from '@/utils/utils';
// import { getLoggedUser } from '@/utils/utils';

export default function AppointmentsPage() {
  const loggedUser = getLoggedUser();
  const { bookings } = useFetchBookings();

  if (!loggedUser) return <p>Please log in to view your appointments.</p>;

  return (
    <div>
      <ul className='flex'>
        {bookings?.map((booking) => (
          <li key={booking.id}>
            <BookingCard booking={booking} />
          </li>
        ))}
      </ul>
    </div>
  );
}
