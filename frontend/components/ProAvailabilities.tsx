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

export default function ProAvailabilities() {
  const userId = getLoggedUser()?.id ?? 0;

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
          onConfirm={() => {}}
          isLoading={isCreating}
        >
          <AvailabilityForm professionalId={userId} onSubmit={handleSubmit} />
        </Modal>
      </div>

      <ul className='mt-4 space-y-2'>
        {availabilities?.map((availability) => (
          <li key={availability.professionalId} className='p-2 bg-gray-100 rounded-md'>
            <span className='font-medium'>{formatDateFR(availability.date)}</span> —{' '}
            {availability.startHour} à {availability.endHour}
          </li>
        ))}
      </ul>
    </>
  );
}
