import { apiFetch } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export type Review = {
  id: number;
  bookingId: number;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
  professionalId: number;
  customerId: number;
};

export default function useFetchProReview(proId: number) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => apiFetch<Review[]>(`/reviews/${proId}`),
  });

  return { reviews, isLoading };
}
