'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrashIcon } from '@heroicons/react/24/outline';
import { apiFetch } from '@/services/api';
import useFetchUserById from '@/features/users/hooks/useFetchUserById';
import useDeleteReview from '@/features/reviews/hooks/useDeleteReview';

import './AllReviews.scss';
import Spinner from '@/components/Spinner';

type Review = {
  id: number;
  bookingId: number;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
  professionalId: number;
  customerId: number;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className='reviews__stars'>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`reviews__star ${star <= rating ? 'reviews__star--filled' : ''}`}
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ))}
    </div>
  );
}

function ReviewRow({ review, onDelete }: { review: Review; onDelete: (id: number) => void }) {
  const { userFullName: customerName } = useFetchUserById(review.customerId);
  const { userFullName: proName } = useFetchUserById(review.professionalId);
  const [confirming, setConfirming] = useState(false);

  return (
    <tr className='reviews__row'>
      {/* Client */}
      <td className='reviews__cell'>
        <div className='reviews__user'>
          <div className='reviews__avatar'>{customerName?.charAt(0).toUpperCase() ?? '?'}</div>
          <span className='reviews__name'>{customerName ?? '…'}</span>
        </div>
      </td>

      {/* Pro */}
      <td className='reviews__cell'>
        <span className='reviews__pro'>{proName ?? '…'}</span>
      </td>

      {/* Rating */}
      <td className='reviews__cell'>
        <div className='reviews__rating'>
          <StarRating rating={review.rating} />
          <span className='reviews__rating-value'>{review.rating}/5</span>
        </div>
      </td>

      {/* Comment */}
      <td className='reviews__cell reviews__cell--comment'>
        {review.comment ? (
          <p className='reviews__comment'>&quot;{review.comment}&quot;</p>
        ) : (
          <span className='reviews__empty'>—</span>
        )}
      </td>

      {/* Date */}
      <td className='reviews__cell reviews__cell--date'>
        <span className='reviews__date'>
          {new Date(review.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </td>

      {/* Delete */}
      <td className='reviews__cell'>
        {confirming ? (
          <div className='reviews__actions-confirm'>
            <button
              onClick={() => onDelete(review.id)}
              className='reviews__btn reviews__btn--confirm'
            >
              Confirmer
            </button>
            <button
              onClick={() => setConfirming(false)}
              className='reviews__btn reviews__btn--cancel'
            >
              Annuler
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} className='reviews__delete'>
            <TrashIcon className='w-4 h-4' />
          </button>
        )}
      </td>
    </tr>
  );
}

export default function AllReviews() {
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: () => apiFetch('/reviews'),
  });

  const { deleteReview } = useDeleteReview();

  const reviewList = reviews ?? [];

  if (isLoading) return <Spinner centered={true} />;

  return (
    <div className='reviews'>
      {/* Header */}
      <div className='reviews__header'>
        <h2 className='reviews__title'>Avis clients</h2>
      </div>

      {/* Table */}
      {reviewList.length === 0 ? (
        <div className='reviews__empty-state'>
          <span>⭐</span>
          <p className='reviews__empty-text'>Aucun avis pour le moment.</p>
        </div>
      ) : (
        <div className='reviews__table-wrapper'>
          <table className='reviews__table'>
            <thead>
              <tr className='reviews__thead-row'>
                {['Client', 'Professionnel', 'Note', 'Commentaire', 'Date', ''].map((h) => (
                  <th key={h} className='reviews__th'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviewList.map((review) => (
                <ReviewRow key={review.id} review={review} onDelete={deleteReview} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
