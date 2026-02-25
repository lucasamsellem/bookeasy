import { apiFetch } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteUser() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { deleteUser };
}
