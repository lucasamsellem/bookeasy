'use client';

import useFetchProAvailabilities from '@/features/availabilities/hooks/useFetchProAvailabilities';
import { formatDateFR } from '@/utils/utils';
import ActionButton from '@/components/ActionButton';
import { PlusIcon } from '@heroicons/react/24/outline';
import useCreateAvailability from '@/features/availabilities/hooks/useCreateAvailability';
import useModal from '@/hooks/useModal';
import Modal from '@/components/Modal';
import AvailabilityForm from './AvailabilityForm';
import { Availability } from '@/types/types';
import { useRef } from 'react';
import { useUser } from '@/store/useUser';

export default function ProAvailabilities() {
  const userId = useUser((s) => s.user?.id) ?? 0;
  const formRef = useRef<HTMLFormElement>(null); // 👈

  const { isOpen, openModal, closeModal } = useModal();
  const { availabilities, bookedHours } = useFetchProAvailabilities(userId);
  const { createAvailability, isCreating } = useCreateAvailability();

  const handleSubmit = async (values: Availability) => {
    await createAvailability(values);
    closeModal();
  };

  return (
    <>
      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Mes Disponibilités</h2>

        <ActionButton
          text='Ajouter une disponibilité'
          icon={<PlusIcon className='size-5' />}
          onClick={openModal}
        />

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title='Nouvelle disponibilité'
          confirmLabel='Ajouter'
          onConfirm={() => formRef.current?.requestSubmit()}
          isLoading={isCreating}
        >
          <AvailabilityForm ref={formRef} professionalId={userId} onSubmit={handleSubmit} />
        </Modal>
      </div>

      <ul className='mt-4 space-y-2'>
        {availabilities?.map((availability) => {
          const booked = bookedHours
            .filter((b) => b.date === availability.date)
            .map((b) => b.selectedHour.slice(0, 5));

          return (
            <li
              key={availability.id}
              className='flex flex-col gap-2 px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <span className='text-xl'>📅</span>
                  <span className='text-sm font-semibold text-gray-800'>
                    {formatDateFR(availability.date)}
                  </span>
                </div>
                <span className='text-xs font-mono bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1 rounded-lg'>
                  {availability.startHour.slice(0, 5)} → {availability.endHour.slice(0, 5)}
                </span>
              </div>

              {booked.length > 0 && (
                <div className='flex flex-wrap gap-1.5'>
                  {booked.map((hour) => (
                    <span
                      key={hour}
                      className='text-xs font-mono bg-rose-50 border border-rose-100 text-rose-400 px-2 py-0.5 rounded-lg'
                    >
                      {hour} réservé
                    </span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
