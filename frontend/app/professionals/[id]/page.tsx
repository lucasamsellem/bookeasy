'use client';

import { useParams } from 'next/navigation';
import Spinner from '@/components/Spinner';
import ActionButton from '@/components/ActionButton';
import Modal from '@/components/Modal';
import useModal from '@/hooks/useModal';
import NewBookingForm from '@/components/NewBookingForm';
import useFetchUserById from '@/hooks/useFetchUserById';

export default function ProfessionalPage() {
  const { isOpen, openModal, closeModal } = useModal();

  const { id } = useParams() as { id: string };
  const { user: professional, isUserLoading } = useFetchUserById(id);

  if (!professional) {
    return <p>Professionnel introuvable.</p>;
  }

  if (isUserLoading) {
    return <Spinner />;
  }

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-2'>
        {professional.firstName} {professional.lastName}
      </h1>
      <p className='text-lg text-gray-700 mb-4'>{professional.profession}</p>

      <div className='mb-4'>
        <h2 className='font-semibold'>Contact</h2>
        <p>
          Email:{' '}
          <a href={`mailto:${professional.email}`} className='text-blue-600 hover:underline'>
            {professional.email}
          </a>
        </p>
      </div>

      {professional.street && professional.city && (
        <div className='mb-4'>
          <h2 className='font-semibold'>Adresse</h2>
          <p>
            {professional.street} {professional.streetNumber || ''}, {professional.city}
          </p>
        </div>
      )}

      <p className='text-sm text-gray-400'>
        Membre depuis: {new Date(professional.createdAt).toLocaleDateString()}
      </p>

      <footer>
        <ActionButton text='New Appointment' icon='+' onClick={openModal} />
      </footer>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={`Create Booking - ${professional.firstName} ${professional.lastName}`}
      >
        <NewBookingForm professionalId={professional.id} />
      </Modal>
    </div>
  );
}
