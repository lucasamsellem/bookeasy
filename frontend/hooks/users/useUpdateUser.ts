import { apiFetch } from '@/services/api';
import { User } from '@shared/types/sharedTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateUser, isPending: isUserUpdating } = useMutation({
    mutationFn: ({ id, firstName, lastName, city, street, streetNumber }: Partial<User>) =>
      apiFetch(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName, city, street, streetNumber }),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { updateUser, isUserUpdating };
}
