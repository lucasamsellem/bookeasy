import { apiFetch } from '@/services/api';
import { Availability } from '@/types/availability';
import { useQuery } from '@tanstack/react-query';

export default function useFetchProAvailabilities(proId: number) {
  const token = localStorage.getItem('token');

  const { data: availabilities, isLoading } = useQuery({
    queryKey: ['availabilities'],
    queryFn: () =>
      apiFetch<Availability[]>(`/availabilities/${proId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  return { availabilities, isLoading };
}
