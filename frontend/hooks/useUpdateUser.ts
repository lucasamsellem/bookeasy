import { apiFetch } from '@/services/api';
import { User } from '@backend/controllers/user.controller';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { mutateAsync: updateUser } = useMutation({
    mutationFn: ({ id, firstName, lastName, city, street, streetNumber }: Partial<User>) =>
      apiFetch(`/users/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstName, lastName, city, street, streetNumber }),
        credentials: 'include',
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { updateUser };
}
