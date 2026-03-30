'use client';

import useFetchUserById from '@/hooks/useFetchUserById';
import useDeleteReview from '@/hooks/useDeleteReview';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

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
    <div className='flex gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`}
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
    <tr className='group border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors'>
      {/* Client */}
      <td className='py-3.5 px-4'>
        <div className='flex items-center gap-2'>
          <div className='w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 shrink-0'>
            {customerName?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <span className='text-sm text-gray-800 font-medium'>{customerName ?? '…'}</span>
        </div>
      </td>

      {/* Pro */}
      <td className='py-3.5 px-4'>
        <span className='text-sm text-gray-600'>{proName ?? '…'}</span>
      </td>

      {/* Note */}
      <td className='py-3.5 px-4'>
        <div className='flex items-center gap-1.5'>
          <StarRating rating={review.rating} />
          <span className='text-xs text-gray-400 tabular-nums'>{review.rating}/5</span>
        </div>
      </td>

      {/* Commentaire */}
      <td className='py-3.5 px-4 max-w-xs'>
        {review.comment ? (
          <p className='text-sm text-gray-500 italic truncate'>&quot;{review.comment}&quot;</p>
        ) : (
          <span className='text-xs text-gray-300'>—</span>
        )}
      </td>

      {/* Date */}
      <td className='py-3.5 px-4 whitespace-nowrap'>
        <span className='text-xs text-gray-400'>
          {new Date(review.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </td>

      {/* Supprimer */}
      <td className='py-3.5 px-4'>
        {confirming ? (
          <div className='flex items-center gap-2'>
            <button
              onClick={() => onDelete(review.id)}
              className='text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors'
            >
              Confirmer
            </button>
            <button
              onClick={() => setConfirming(false)}
              className='text-xs text-gray-400 hover:text-gray-600 transition-colors'
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className='opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-rose-50 text-gray-300 hover:text-rose-500'
          >
            <TrashIcon className='w-4 h-4' />
          </button>
        )}
      </td>
    </tr>
  );
}

export default function AllReviews() {
  const { data: reviews } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: () => apiFetch('/reviews'),
  });

  const { deleteReview } = useDeleteReview();

  const reviewList = reviews ?? [];

  return (
    <div className='flex flex-col gap-6'>
      {/* Header + stats */}
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-900'>Avis clients</h2>
      </div>

      {/* Table */}
      {reviewList.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-16 text-center gap-2 bg-white rounded-2xl border border-gray-100'>
          <span className='text-4xl'>⭐</span>
          <p className='text-sm text-gray-400'>Aucun avis pour le moment.</p>
        </div>
      ) : (
        <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-100 bg-gray-50/80'>
                {['Client', 'Professionnel', 'Note', 'Commentaire', 'Date', ''].map((h) => (
                  <th
                    key={h}
                    className='py-3 px-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'
                  >
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
