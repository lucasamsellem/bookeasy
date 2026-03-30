import { apiFetch } from '@/services/api';
import { Availability } from '@/types/availability';
import { useQuery } from '@tanstack/react-query';

export default function useFetchProAvailabilities(proId: number) {
  const { data: availabilities, isLoading } = useQuery({
    queryKey: ['availabilities'],
    queryFn: () => apiFetch<Availability[]>(`/availabilities/${proId}`, {}),
  });

  return { availabilities, isLoading };
}
