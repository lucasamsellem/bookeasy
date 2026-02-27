'use client';

import useFetchProAvailabilities from '@/hooks/useFetchProAvailabilities';
import { formatDateFR, getLoggedUser } from '@/utils/utils';
import ActionButton from './ActionButton';
import { PlusIcon } from '@heroicons/react/24/outline';
import useFetchUserBookings from '@/hooks/useFetchUserBookings';
import BookingCard from './BookingCard';
import useUpdateBookingStatus from '@/hooks/useUpdateBookingStatus';
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

  const { userBookings } = useFetchUserBookings(userId);
  const { updateBookingStatus } = useUpdateBookingStatus();

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

      <h2 className='mt-6 text-xl font-semibold'>Mes créneaux à venir</h2>
      <ul className='mt-2 space-y-4'>
        {userBookings?.map((booking) => {
          const isConfirmed = booking.status === 'confirmed';
          const isCanceled = booking.status === 'canceled';

          return (
            <li
              key={booking.id}
              className='w-fit bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm'
            >
              <BookingCard booking={booking} />

              <div className='flex justify-center border-t border-gray-200'>
                <button
                  disabled={isConfirmed}
                  onClick={() => updateBookingStatus({ id: booking.id, status: 'confirmed' })}
                  className={`w-full py-2 transition ${
                    isConfirmed
                      ? 'bg-green-300 cursor-not-allowed text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Confirm
                </button>

                <button
                  disabled={isCanceled}
                  onClick={() => updateBookingStatus({ id: booking.id, status: 'canceled' })}
                  className={`w-full py-2 transition ${
                    isCanceled
                      ? 'bg-red-300 cursor-not-allowed text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
