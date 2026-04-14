'use client';

import Spinner from '@/components/Spinner';
import BookingCard from '@/features/bookings/components/BookingCard';
import useFetchUserBookings from '@/features/bookings/hooks/useFetchUserBookings';
import { useUser } from '@/store/useUser';

export default function BookingsPage() {
  const { user: loggedUser, hasHydrated } = useUser();
  const { userBookings } = useFetchUserBookings(loggedUser?.id ?? 0);

  if (!hasHydrated) return <Spinner centered={true} />;

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
