import useCreateReview from '@/hooks/reviews/useCreateReview';
import useDeleteBooking from '@/hooks/bookings/useDeleteBooking';
import useFetchUserById from '@/hooks/users/useFetchUserById';
import useUpdateBookingStatus from '@/hooks/bookings/useUpdateBookingStatus';
import { getLoggedUser } from '@/utils/utils';
import { Booking, BookingStatus } from '@backend/controllers/booking.controller';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import './BookingCard.scss';

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
  const { userFullName: proFullName, user: pro } = useFetchUserById(professionalId);
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
    <div className='booking-card'>
      {/* Top bar */}
      <div
        className={`
          booking-card__bar
          ${hasPassed ? 'booking-card__bar--past' : `booking-card__bar--${status}`}
        `}
      />

      <div className='booking-card__content'>
        {/* Header */}
        <div className='booking-card__header'>
          <div>
            <p className='booking-card__name'>{proFullName}</p>
            <p className='booking-card__profession'>{pro?.profession}</p>
          </div>

          <span
            className={`
              booking-card__status
              ${hasPassed ? 'booking-card__status--past' : `booking-card__status--${status}`}
            `}
          >
            <span className='booking-card__status-dot' />
            {hasPassed ? 'Passé' : s.label}
          </span>
        </div>

        <div className='booking-card__divider' />

        {/* Date */}
        <div className='booking-card__datetime'>
          <div className='booking-card__date'>
            <span>📅</span>
            <span className='booking-card__date-text'>
              {' '}
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

          <span className='booking-card__hour'>{selectedHour.slice(0, 5)}</span>

          <span className='booking-card__customer'>avec {customerFullName}</span>
        </div>

        {(isPro || isAdmin) && !hasPassed && (
          <div className='booking-card__actions'>
            <button
              onClick={() => updateBookingStatus({ id: booking.id, status: 'confirmed' })}
              className='booking-card__btn booking-card__btn--confirm'
            >
              Confirmer
            </button>

            <button
              onClick={() => deleteBooking(booking.id)}
              className='booking-card__btn booking-card__btn--cancel'
            >
              Annuler
            </button>
          </div>
        )}

        {/* Review */}
        {hasPassed && (
          <div className='booking-card__review'>
            {isReviewCreated ? (
              <div className='booking-card__review-success'>
                <span>✅</span>
                <span>Avis envoyé, merci !</span>
              </div>
            ) : (
              <button
                onClick={() => setShowReviewForm((prev) => !prev)}
                className='booking-card__review-toggle'
              >
                <StarIcon className='booking-card__icon-small' />
                {showReviewForm ? 'Annuler' : 'Laisser un avis'}
              </button>
            )}

            {showReviewForm && !isReviewCreated && (
              <div className='booking-card__review-form'>
                <div className='booking-card__stars'>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= (hoveredRating || rating);
                    return (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        className='booking-card__star'
                      >
                        {filled ? (
                          <StarIconSolid className='booking-card__star-icon booking-card__star-icon--filled' />
                        ) : (
                          <StarIcon className='booking-card__star-icon' />
                        )}
                      </button>
                    );
                  })}
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className='booking-card__textarea'
                  placeholder='Votre commentaire (optionnel)...'
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={rating === 0}
                  className='booking-card__submit'
                >
                  Envoyer
                </button>
              </div>
            )}
          </div>
        )}

        {description && <p className='booking-card__description'>&quot;{description}&quot;</p>}
      </div>
    </div>
  );
}
