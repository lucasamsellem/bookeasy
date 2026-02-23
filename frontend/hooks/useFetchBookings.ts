import { apiFetch } from '@/services/api';
import { Booking } from '@backend/controllers/booking.controller';
import { useQuery } from '@tanstack/react-query';

export default function useFetchBookings() {
  const token = localStorage.getItem('token');

  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: () =>
      apiFetch<Booking[]>('/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  return { bookings };
}
