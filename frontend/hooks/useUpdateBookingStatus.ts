import { apiFetch } from '@/services/api';
import { BookingStatus } from '@backend/controllers/booking.controller';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { mutateAsync: updateBookingStatus, isPending: isBookingStatusUpdating } = useMutation({
    mutationFn: ({ id, status }: { id: number; status: BookingStatus }) =>
      apiFetch(`/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ status }),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  return { updateBookingStatus, isBookingStatusUpdating };
}
