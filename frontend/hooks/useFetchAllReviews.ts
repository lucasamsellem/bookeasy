import { useQuery } from '@tanstack/react-query';
import { Review } from './useFetchUserReviews';
import { apiFetch } from '@/services/api';

// useFetchAllReviews.ts
export default function useFetchAllReviews() {
  const { data: reviews } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: () => apiFetch('/reviews'),
  });
  return { reviews: reviews ?? [] };
}
