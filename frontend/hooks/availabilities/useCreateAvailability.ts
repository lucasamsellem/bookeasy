import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Availability } from '@/types/availability';

export default function useCreateAvailability() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (availability: Availability) =>
      apiFetch('/availabilities', {
        method: 'POST',
        body: JSON.stringify(availability),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availabilities'] });
    },
  });

  return { createAvailability: mutateAsync, isCreating: isPending };
}
