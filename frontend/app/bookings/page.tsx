'use client';

import BookingCard from '@/components/BookingCard';
import useFetchUserBookings from '@/hooks/useFetchUserBookings';
import { getLoggedUser } from '@/utils/utils';

export default function BookingsPage() {
  const loggedUser = getLoggedUser();
  const { userBookings } = useFetchUserBookings(loggedUser?.id ?? 0);

  if (!loggedUser) return <p>Please log in to view your Bookings.</p>;

  return (
    <div className='p-10'>
      <ul className='grid grid-cols-5 gap-5 '>
        {userBookings?.map((booking) => (
          <li key={booking.id}>
            <BookingCard booking={booking} />
          </li>
        ))}
      </ul>
    </div>
  );
}
