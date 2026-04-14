import { apiFetch } from '@/services/api';
import { Booking } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export default function useFetchBookings() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => apiFetch<Booking[]>('/bookings'),
  });

  return { bookings, isLoading };
}
