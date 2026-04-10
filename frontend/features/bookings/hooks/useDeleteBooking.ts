import { apiFetch } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { mutate: deleteBooking } = useMutation({
    mutationFn: (id: number) => apiFetch(`/bookings/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  return { deleteBooking };
}
