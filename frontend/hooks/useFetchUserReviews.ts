import { apiFetch } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export default function useFetchProReview(proId: number) {
  const { data: reviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => apiFetch(`/reviews/${proId}`),
  });

  return { reviews };
}
