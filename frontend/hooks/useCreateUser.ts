import { RegisterBody } from '@/components/RegisterForm';
import { apiFetch } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useCreateUser() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { mutateAsync: createUser, isSuccess: isUserCreated } = useMutation({
    mutationFn: (data: RegisterBody) =>
      apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Create user ADMIN route
  const { mutateAsync: createUserFromAdmin } = useMutation({
    mutationFn: (form: RegisterBody) =>
      apiFetch('/users/admin', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { createUser, createUserFromAdmin, isUserCreated };
}
