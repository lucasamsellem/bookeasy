'use client';

import Link from 'next/link';
import ActionButton from './ActionButton';
import { User } from '@backend/controllers/user.controller';
import useModal from '@/hooks/useModal';
import Modal from './Modal';
import NewBookingForm from './NewBookingForm';
import { useMemo, useState } from 'react';
import Avatar from './Avatar';
import ProfessionalsFilterBar from './ProfessionalsFilterBar';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { Review } from '@/hooks/useFetchUserReviews';

function MiniStars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className='flex items-center gap-1.5'>
      <div className='flex gap-0.5'>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
          </svg>
        ))}
      </div>
      <span className='text-xs text-gray-400'>
        {rating.toFixed(1)} <span className='text-gray-300'>·</span> {count} avis
      </span>
    </div>
  );
}

export default function ProfessionalsList() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedPro, setSelectedPro] = useState<User | null>(null);

  const { data: professionals } = useQuery<User[]>({
    queryKey: ['professionals'],
    queryFn: () => apiFetch('/customers/professionals'),
  });

  const { data: allReviews } = useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: () => apiFetch('/reviews'),
  });

  // Calcul note moyenne + count par pro, indexé par professionalId
  const reviewsByPro = useMemo(() => {
    if (!allReviews) return {};
    return allReviews.reduce<Record<number, { avg: number; count: number; latest?: string }>>(
      (acc, review) => {
        const pid = review.professionalId;
        if (!acc[pid]) acc[pid] = { avg: 0, count: 0 };
        acc[pid].count += 1;
        acc[pid].avg += review.rating;
        if (!acc[pid].latest && review.comment) acc[pid].latest = review.comment;
        return acc;
      },
      {},
    );
  }, [allReviews]);

  const [filters, setFilters] = useState({
    profession: null as string | null,
    name: '',
    location: '',
  });

  const filteredProfessionals = useMemo(() => {
    if (!professionals) return [];
    return professionals.filter((p) => {
      const matchProfession = !filters.profession || p.profession === filters.profession;
      const matchName =
        !filters.name ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(filters.name.toLowerCase());
      const matchLocation =
        !filters.location || p.city?.toLowerCase().includes(filters.location.toLowerCase());
      return matchProfession && matchName && matchLocation;
    });
  }, [professionals, filters]);

  const handleNewBooking = (pro: User) => {
    setSelectedPro(pro);
    openModal();
  };

  return (
    <>
      <ProfessionalsFilterBar
        professionals={professionals}
        filters={filters}
        onChange={setFilters}
      />

      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {filteredProfessionals?.map((pro) => {
          const proReviews = reviewsByPro[pro.id];
          const avg = proReviews ? proReviews.avg / proReviews.count : null;

          return (
            <li
              key={pro.id}
              className='group flex flex-col bg-white rounded-2xl border border-gray-200 p-6 transition hover:shadow-sm hover:border-gray-300'
            >
              <Link
                href={`/professionals/${pro.id}`}
                className='flex flex-col items-center gap-3 text-center'
              >
                <Avatar id={pro.id} />

                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {pro.firstName} {pro.lastName}
                  </h3>
                  <p className='text-sm text-gray-500'>{pro.profession}</p>
                </div>

                {pro.city && <p className='text-xs text-gray-400'>{pro.city}</p>}

                {/* Aperçu reviews */}
                {avg !== null && proReviews ? (
                  <div className='flex flex-col items-center gap-1.5 w-full'>
                    <MiniStars rating={avg} count={proReviews.count} />
                  </div>
                ) : (
                  <p className='text-xs text-gray-300 italic'>Aucun avis</p>
                )}
              </Link>

              <div className='mt-5 w-full flex justify-center'>
                <ActionButton text='New Booking' icon='+' onClick={() => handleNewBooking(pro)} />
              </div>
            </li>
          );
        })}
      </ul>

      {selectedPro && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={`New Booking - ${selectedPro.firstName} ${selectedPro.lastName}`}
        >
          <NewBookingForm professionalId={selectedPro.id} />
        </Modal>
      )}
    </>
  );
}
