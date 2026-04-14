import { apiFetch } from '@/services/api';
import { User } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export default function useFetchUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiFetch<User[]>('/users'),
  });

  return { users, isLoading };
}
