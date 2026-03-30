import { apiFetch } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateReviewData {
  bookingId: number;
  professionalId: number;
  customerId: number;
  rating: number;
  comment?: string;
}

export default function useCreateReview() {
  const queryClient = useQueryClient();

  const { mutateAsync: createReview, isSuccess: isReviewCreated } = useMutation({
    mutationFn: (data: CreateReviewData) =>
      apiFetch('/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'professional', variables.professionalId],
      });
    },
  });

  return { createReview, isReviewCreated };
}
