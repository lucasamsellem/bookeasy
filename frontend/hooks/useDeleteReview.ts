import { apiFetch } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// useDeleteReview.ts
export default function useDeleteReview() {
  const queryClient = useQueryClient();

  const { mutate: deleteReview } = useMutation({
    mutationFn: (id: number) => apiFetch(`/reviews/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  return { deleteReview };
}
