import useFetchUserById from '@/hooks/users/useFetchUserById';
import { Review } from '@/hooks/reviews/useFetchUserReviews';
import StarRating from './StarRating';

export default function ReviewCard({ review }: { review: Review }) {
  const { userFullName: customerFullName } = useFetchUserById(review.customerId);

  return (
    <div className='flex flex-col gap-2 py-4 border-b border-gray-100 last:border-0'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 shrink-0'>
            {customerFullName?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <span className='text-sm font-medium text-gray-700'>{customerFullName ?? '...'}</span>
        </div>
        <span className='text-xs text-gray-400'>
          {new Date(review.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>

      <StarRating rating={review.rating} />

      {review.comment && (
        <p className='text-sm text-gray-600 leading-relaxed italic'>&quot;{review.comment}&quot;</p>
      )}
    </div>
  );
}
