'use client';

import useFetchProAvailabilities from '@/hooks/useFetchProAvailabilities';
import { formatDateFR, getLoggedUser } from '@/utils/utils';
import ActionButton from './ActionButton';
import { PlusIcon } from '@heroicons/react/24/outline';
import useCreateAvailability from '@/hooks/useCreateAvailability';
import useModal from '@/hooks/useModal';
import Modal from './Modal';
import AvailabilityForm from './AvailabilityForm';
import { Availability } from '@/types/availability';
import { useRef } from 'react';

export default function ProAvailabilities() {
  const userId = getLoggedUser()?.id ?? 0;
  const formRef = useRef<HTMLFormElement>(null); // 👈

  const { isOpen, openModal, closeModal } = useModal();
  const { availabilities } = useFetchProAvailabilities(userId);
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
        {availabilities?.map((availability) => (
          <li
            key={availability.id}
            className='flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100'
          >
            <div className='flex items-center gap-3'>
              <span className='text-xl'>📅</span>
              <span className='text-sm font-semibold text-gray-800'>
                {formatDateFR(availability.date)}
              </span>
            </div>
            <span className='text-xs font-mono bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1 rounded-lg'>
              {availability.startHour.slice(0, 5)} → {availability.endHour.slice(0, 5)}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
