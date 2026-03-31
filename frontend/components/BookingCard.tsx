import useCreateReview from '@/hooks/useCreateReview';
import useDeleteBooking from '@/hooks/useDeleteBooking';
import useFetchUserById from '@/hooks/useFetchUserById';
import useUpdateBookingStatus from '@/hooks/useUpdateBookingStatus';
import { getLoggedUser } from '@/utils/utils';
import { Booking, BookingStatus } from '@backend/controllers/booking.controller';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface BookingCardProps {
  booking: Booking;
}

const statusConfig: Record<BookingStatus, { label: string; dot: string; text: string }> = {
  pending: { label: 'En attente', dot: 'bg-amber-400', text: 'text-amber-700' },
  confirmed: { label: 'Confirmé', dot: 'bg-emerald-400', text: 'text-emerald-700' },
  canceled: { label: 'Annulé', dot: 'bg-rose-400', text: 'text-rose-700' },
};

function buildBookingDate(date: Date | string, hour: string): Date {
  if (!date || !hour) return new Date();
  const [hours, minutes] = hour.split(':').map(Number);
  const dateStr = typeof date === 'string' ? date : date.toISOString();
  const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d, hours, minutes, 0, 0);
}

export default function BookingCard({ booking }: BookingCardProps) {
  const { customerId, professionalId, selectedDate, selectedHour, status, description } = booking;

  const loggedUser = getLoggedUser();
  const isPro = loggedUser?.id === professionalId;
  const isAdmin = loggedUser?.role === 'superAdmin';

  const { userFullName: customerFullName } = useFetchUserById(customerId);
  const { userFullName: proFullName } = useFetchUserById(professionalId);
  const { createReview, isReviewCreated } = useCreateReview();

  const BookingDate = buildBookingDate(selectedDate!, selectedHour);
  const now = new Date();
  const hasPassed = BookingDate <= now;

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const { updateBookingStatus } = useUpdateBookingStatus();
  const { deleteBooking } = useDeleteBooking();

  const handleSubmitReview = () => {
    if (rating === 0) return;
    createReview({
      bookingId: booking.id,
      professionalId,
      customerId,
      rating,
      comment: reviewText,
    });
  };

  const s = statusConfig[status];

  return (
    <div
      className={`relative bg-white rounded-3xl overflow-hidden max-w-sm w-full transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 `}
    >
      {/* Bande colorée top selon statut */}
      <div
        className={`h-1 w-full ${
          hasPassed
            ? 'bg-gray-200'
            : status === 'confirmed'
              ? 'bg-emerald-400'
              : status === 'pending'
                ? 'bg-amber-400'
                : 'bg-rose-400'
        }`}
      />

      <div className='p-5 flex flex-col gap-4'>
        {/* Header : pro + statut */}
        <div className='flex items-start justify-between gap-2'>
          <div>
            <p className='font-semibold text-gray-900 text-base leading-tight'>{proFullName}</p>
            <p className='text-gray-400 text-xs mt-0.5'>avec {customerFullName}</p>
          </div>

          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
              hasPassed
                ? 'bg-gray-50 border border-gray-100 text-gray-400'
                : `bg-gray-50 border border-gray-100 ${s.text}`
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${hasPassed ? 'bg-gray-300' : s.dot}`} />
            {hasPassed ? 'Passé' : s.label}
          </span>
        </div>

        {/* Séparateur */}
        <div className='h-px bg-gray-100' />

        {/* Date + heure */}
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center gap-2 text-gray-600'>
            <span className='text-base'>📅</span>
            <span className='font-medium'>
              {(() => {
                const raw = new Date(selectedDate!);
                return new Date(
                  raw.getUTCFullYear(),
                  raw.getUTCMonth(),
                  raw.getUTCDate(),
                ).toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                });
              })()}
            </span>
          </div>
          <span className='bg-gray-50 border border-gray-100 text-gray-700 font-mono text-xs px-2.5 py-1 rounded-lg'>
            {selectedHour.slice(0, 5)}
          </span>
        </div>

        {(isPro || isAdmin) && !hasPassed && (
          <div className='flex gap-2'>
            <button
              onClick={() => updateBookingStatus({ id: booking.id, status: 'confirmed' })}
              className='flex-1 text-xs font-semibold bg-emerald-500 text-white px-3 py-1.5 rounded-xl hover:bg-emerald-600 transition-all'
            >
              Confirmer
            </button>
            <button
              onClick={() => deleteBooking(booking.id)}
              className='flex-1 text-xs font-semibold bg-rose-500 text-white px-3 py-1.5 rounded-xl hover:bg-rose-600 transition-all'
            >
              Annuler
            </button>
          </div>
        )}

        {/* Temps restant ou RDV passé */}
        {!hasPassed ? null : (
          <div className='flex flex-col gap-3'>
            {isReviewCreated ? (
              <div className='flex items-center gap-2 bg-emerald-50 text-emerald-600 text-xs font-medium px-3 py-2 rounded-xl'>
                <span>✅</span>
                <span>Avis envoyé, merci !</span>
              </div>
            ) : (
              <button
                onClick={() => setShowReviewForm((prev) => !prev)}
                className='flex items-center gap-1.5 text-xs font-medium text-indigo-500 hover:text-indigo-700 transition-colors w-fit'
              >
                <StarIcon className='size-3.5' />
                {showReviewForm ? 'Annuler' : 'Laisser un avis'}
              </button>
            )}

            {/* Formulaire review */}
            {showReviewForm && !isReviewCreated && (
              <div className='flex flex-col gap-3 pt-1 border-t border-gray-100'>
                {/* Étoiles */}
                <div className='flex gap-1'>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= (hoveredRating || rating);
                    return (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        className='transition-transform hover:scale-110'
                      >
                        {filled ? (
                          <StarIconSolid className='size-6 text-amber-400' />
                        ) : (
                          <StarIcon className='size-6 text-gray-200' />
                        )}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder='Votre commentaire (optionnel)...'
                  rows={2}
                  className='text-xs text-gray-700 border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-gray-300'
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={rating === 0}
                  className='self-end text-xs font-semibold bg-indigo-500 text-white px-4 py-1.5 rounded-xl hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all'
                >
                  Envoyer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className='text-xs text-gray-400 italic border-l-2 border-gray-100 pl-3 leading-relaxed'>
            &quot;{description}&quot;
          </p>
        )}
      </div>
    </div>
  );
}
