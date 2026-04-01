import { apiFetch } from '@/services/api';
import { User } from '@backend/controllers/user.controller';
import { useQuery } from '@tanstack/react-query';

export default function useFetchUsers() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiFetch<User[]>('/users'),
  });

  return { users };
}
