import { apiFetch } from '@/services/api';
import { User } from '@shared/types/sharedTypes';
import { useQuery } from '@tanstack/react-query';

export default function useFetchUsers() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiFetch<User[]>('/users'),
  });

  return { users };
}
