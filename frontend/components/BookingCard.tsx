import useCreateReview from '@/hooks/useCreateReview';
import useFetchUserById from '@/hooks/useFetchUserById';
import { Booking, BookingStatus } from '@backend/controllers/booking.controller';
import { UserIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface BookingCardProps {
  booking: Booking;
}

const statusColors: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
};

function buildAppointmentDate(date: Date, hour: string): Date {
  if (!date || !hour) return new Date();
  const [hours, minutes] = hour.split(':').map(Number);
  const appointment = new Date(date);
  appointment.setHours(hours, minutes, 0, 0);
  return appointment;
}

function formatTimeLeft(ms: number): string {
  const totalMinutes = Math.floor(ms / 1000 / 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}j ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const { customerId, professionalId, selectedDate, selectedHour, status, description } = booking;

  const { userFullName: customerFullName } = useFetchUserById(customerId);
  const { userFullName: proFullName } = useFetchUserById(professionalId);
  const { createReview, isReviewCreated } = useCreateReview();

  const appointmentDate = buildAppointmentDate(selectedDate!, selectedHour);
  const now = new Date();
  const hasPassed = appointmentDate <= now;
  const timeLeftMs = appointmentDate.getTime() - now.getTime();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

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

  return (
    <div
      className={`rounded-2xl p-4 bg-white flex flex-col gap-3 max-w-md ${
        hasPassed ? 'opacity-50' : ''
      }`}
    >
      {/* Header */}
      <div className='flex justify-between flex-col gap-y-1'>
        <div className='flex items-center gap-x-7'>
          <p className='font-semibold text-lg'>{proFullName}</p>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <div className='flex gap-x-1 items-center'>
          <UserIcon className='size-5 text-gray-400' />
          <p className='text-gray-500 text-sm'>{customerFullName}</p>
        </div>
      </div>

      {/* Date + heure */}
      <div className='text-sm text-gray-700'>
        <p>
          📅 {new Date(selectedDate!).toLocaleDateString('fr-FR')} à {selectedHour.slice(0, 5)}
        </p>
      </div>

      {/* Temps restant */}
      {!hasPassed && (
        <p className='text-sm text-blue-600 font-medium'>⏳ Dans {formatTimeLeft(timeLeftMs)}</p>
      )}

      {hasPassed && (
        <div className='flex flex-col gap-2'>
          <p className='text-sm text-gray-400 italic'>RDV passé</p>

          {/* Bouton / confirmation */}
          {isReviewCreated ? (
            <p className='text-sm text-green-600 font-medium'>✅ Avis envoyé, merci !</p>
          ) : (
            <button
              onClick={() => setShowReviewForm((prev) => !prev)}
              className='flex items-center gap-1 text-sm text-indigo-600 font-medium hover:underline w-fit'
            >
              <StarIcon className='size-4' />
              {showReviewForm ? 'Annuler' : 'Laisser un avis'}
            </button>
          )}

          {/* Formulaire inline */}
          {showReviewForm && !isReviewCreated && (
            <div className='flex flex-col gap-2 pt-1'>
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
                    >
                      {filled ? (
                        <StarIconSolid className='size-6 text-yellow-400' />
                      ) : (
                        <StarIcon className='size-6 text-gray-300' />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Commentaire */}
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder='Votre commentaire (optionnel)...'
                rows={3}
                className='text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300'
              />

              <button
                onClick={handleSubmitReview}
                disabled={rating === 0}
                className='self-end text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
              >
                Envoyer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className='text-gray-600 text-sm italic border-l-2 border-gray-200 pl-2'>
          &quot;{description}&quot;
        </p>
      )}
    </div>
  );
}
