import { apiFetch } from '@/services/api';
import { Availability } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function useFetchProAvailabilities(proId: number) {
  const { data, isLoading } = useQuery({
    queryKey: ['availabilities', proId],

    queryFn: () =>
      apiFetch<{
        availabilities: Availability[];
        bookedHours: { date: string; selectedHour: string }[];
      }>(`/availabilities/${proId}`),

    select: (data) => ({
      availabilities: data.availabilities.map((a) => ({
        ...a,
        date: toDateKey(new Date(a.date)),
      })),
      bookedHours: data.bookedHours,
    }),
  });

  return {
    availabilities: data?.availabilities ?? [],
    bookedHours: data?.bookedHours ?? [],
    isLoading,
  };
}
