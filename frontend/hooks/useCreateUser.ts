import { RegisterBody } from '@/components/RegisterForm';
import { apiFetch } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useCreateUser() {
  const queryClient = useQueryClient();

  const { mutateAsync: createUser, isSuccess: isUserCreated } = useMutation({
    mutationFn: async (data: RegisterBody) => {
      return apiFetch('/users', { method: 'POST', body: JSON.stringify(data) });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { createUser, isUserCreated };
}
