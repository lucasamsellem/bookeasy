import { apiFetch } from '@/services/api';
import { User } from '@backend/controllers/user.controller';
import { useQuery } from '@tanstack/react-query';

export default function useFetchUserById(id: string | number) {
  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ['professional', id],
    queryFn: () => apiFetch(`/users/${id}`),
  });

  return { user, isUserLoading };
}
