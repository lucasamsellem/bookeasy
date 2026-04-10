import { apiFetch } from '@/services/api';
import { User } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export default function useFetchUserById(id: string | number) {
  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: ['professional', id],
    queryFn: () => apiFetch(`/users/${id}`),
  });

  const userFullName = `${user?.firstName} ${user?.lastName}`;

  return { user, isUserLoading, userFullName };
}
