import { apiFetch } from '@/services/api';
import { Booking } from '@backend/controllers/booking.controller';
import { useQuery } from '@tanstack/react-query';

export default function useFetchUserBookings(userId: number) {
  const { data: userBookings, isLoading: isFetchingUserBookings } = useQuery<Booking[]>({
    queryKey: ['bookings', userId],
    queryFn: () => {
      return apiFetch(`/bookings/user/${userId}`, {
        method: 'GET',
      });
    },
    enabled: !!userId, // évite l'appel si userId undefined
  });

  return { userBookings, isFetchingUserBookings };
}
