import { apiFetch } from '@/services/api';
import { Availability } from '@/types/availability';
import { useQuery } from '@tanstack/react-query';

export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function useFetchProAvailabilities(proId: number) {
  const { data: availabilities, isLoading } = useQuery({
    queryKey: ['availabilities', proId],
    queryFn: () => apiFetch<Availability[]>(`/availabilities/${proId}`),
    select: (availabilities) =>
      availabilities.map((a) => ({
        ...a,
        date: toDateKey(new Date(a.date)),
      })),
  });

  return { availabilities, isLoading };
}
