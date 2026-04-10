import { apiFetch } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteUser() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteUser, isPending: isUserDeleting } = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/users/${id}`, {
        method: 'DELETE',
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { deleteUser, isUserDeleting };
}
