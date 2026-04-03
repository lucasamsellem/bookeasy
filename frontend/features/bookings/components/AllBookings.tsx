'use client';

import useFetchBookings from '@/hooks/bookings/useFetchBookings';
import BookingCard from './BookingCard';

export default function AllBookings() {
  const { bookings } = useFetchBookings();

  return (
    <>
      <h2 className='text-2xl font-semibold mb-3'>Toutes les réservations</h2>

      <ul className='grid grid-cols-5 gap-5'>
        {bookings?.map((booking) => (
          <li key={booking.id}>
            <BookingCard booking={booking} />
          </li>
        ))}
      </ul>
    </>
  );
}
