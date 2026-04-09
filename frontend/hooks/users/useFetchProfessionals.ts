import { apiFetch } from '@/services/api';
import { User } from '@shared/types/sharedTypes';
import { useQuery } from '@tanstack/react-query';

export default function useFetchProfessionals() {
  const { data: professionals } = useQuery({
    queryKey: ['professionals'],
    queryFn: () => apiFetch<User[]>('/customers/professionals'),
  });

  return { professionals };
}
