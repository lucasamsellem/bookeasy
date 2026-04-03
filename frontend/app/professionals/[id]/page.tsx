'use client';

import { useParams } from 'next/navigation';
import Spinner from '@/components/Spinner';
import NewBookingForm from '@/features/bookings/components/NewBookingForm';
import useFetchUserById from '@/hooks/users/useFetchUserById';
import Avatar from '@/features/users/components/Avatar';
import useFetchProReview, { Review } from '@/hooks/reviews/useFetchUserReviews';
import StarRating from '@/features/reviews/components/StarRating';
import ReviewCard from '@/features/reviews/components/ReviewCard';

function AverageRating({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return (
    <div className='flex items-center gap-2'>
      <span className='text-2xl font-bold text-gray-900'>{avg.toFixed(1)}</span>
      <div className='flex flex-col gap-0.5'>
        <StarRating rating={Math.round(avg)} />
        <span className='text-xs text-gray-400'>{reviews.length} avis</span>
      </div>
    </div>
  );
}

export default function ProfessionalPage() {
  const { id } = useParams() as { id: string };
  const { user: professional, isUserLoading, userFullName: proFullName } = useFetchUserById(id);
  const { reviews } = useFetchProReview(Number(id));

  const reviewList = (reviews as Review[]) ?? [];

  if (isUserLoading) return <Spinner centered={true} />;
  if (!professional) return <p>Professionnel introuvable.</p>;

  return (
    <div className='min-h-screen bg-gray-50/60'>
      <div className='max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8'>
        {/* Hero card */}
        <div className='bg-white rounded-3xl shadow-sm overflow-hidden'>
          {/* Bannière top */}
          <div className='h-24 bg-linear-to-r from-slate-800 to-slate-600' />

          <div className='px-8 pb-8'>
            {/* Avatar chevauchant la bannière */}
            <div className='-mt-10 mb-4'>
              <div className='w-20 h-20 rounded-full ring-4 ring-white shadow-md overflow-hidden bg-gray-100'>
                <Avatar id={professional.id} />
              </div>
            </div>

            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
              {/* Infos pro */}
              <div className='flex flex-col gap-3'>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>{proFullName}</h1>
                  <p className='text-sm font-medium text-slate-500 mt-0.5'>
                    {professional.profession}
                  </p>
                </div>

                <div className='flex flex-wrap gap-4 text-sm text-gray-500'>
                  <a
                    href={`mailto:${professional.email}`}
                    className='flex items-center gap-1.5 hover:text-slate-800 transition-colors'
                  >
                    <span>✉️</span>
                    {professional.email}
                  </a>

                  {professional.street && professional.city && (
                    <span className='flex items-center gap-1.5'>
                      <span>📍</span>
                      {professional.street} {professional.streetNumber || ''}, {professional.city}
                    </span>
                  )}
                </div>

                <p className='text-xs text-gray-400'>
                  Membre depuis{' '}
                  {new Date(professional.createdAt).toLocaleDateString('fr-FR', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Note moyenne */}
              {reviewList.length > 0 && (
                <div className='bg-gray-50 rounded-2xl px-5 py-3 shrink-0'>
                  <AverageRating reviews={reviewList} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu principal : booking + reviews */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
          {/* Formulaire de réservation */}
          <div className='bg-white rounded-3xl shadow-sm p-6'>
            <h2 className='text-sm font-semibold text-gray-900 uppercase tracking-widest mb-5'>
              Prendre rendez-vous
            </h2>
            <NewBookingForm professionalId={professional.id} />
          </div>

          {/* Avis */}
          <div className='bg-white rounded-3xl shadow-sm p-6 flex flex-col gap-2'>
            <div className='flex items-center justify-between mb-1'>
              <h2 className='text-sm font-semibold text-gray-900 uppercase tracking-widest'>
                Avis clients
              </h2>
              {reviewList.length > 0 && (
                <span className='text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full'>
                  {reviewList.length}
                </span>
              )}
            </div>

            {reviewList.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-10 text-center gap-2'>
                <span className='text-3xl'>⭐</span>
                <p className='text-sm text-gray-400'>Aucun avis pour l&apos;instant.</p>
              </div>
            ) : (
              <div className='divide-y divide-gray-100'>
                {reviewList.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
