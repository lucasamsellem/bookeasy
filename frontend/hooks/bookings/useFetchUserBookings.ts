import { apiFetch } from '@/services/api';
import { Booking } from '@shared/types/sharedTypes';
import { useQuery } from '@tanstack/react-query';

export default function useFetchUserBookings(userId: number) {
  const { data: userBookings, isLoading: isFetchingUserBookings } = useQuery<Booking[]>({
    queryKey: ['bookings', userId],
    queryFn: () => {
      return apiFetch(`/bookings/user/${userId}`);
    },
    enabled: !!userId, // évite l'appel si userId undefined
  });

  return { userBookings, isFetchingUserBookings };
}
