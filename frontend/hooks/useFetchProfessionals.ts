import { apiFetch } from '@/services/api';
import { User } from '@backend/controllers/user.controller';
import { useQuery } from '@tanstack/react-query';

export default function useFetchProfessionals() {
  const { data: professionals } = useQuery({
    queryKey: ['professionals'],
    queryFn: () => apiFetch<User[]>('/customers/professionals'),
  });

  return { professionals };
}
