import { RegisterBody } from '@/features/users/components/RegisterForm';
import { apiFetch } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useCreateUser() {
  const queryClient = useQueryClient();

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
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { createUser, createUserFromAdmin, isUserCreated };
}
