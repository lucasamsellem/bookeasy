'use client';

import Link from 'next/link';
import ActionButton from './ActionButton';
import { User } from '@backend/controllers/user.controller';
import Image from 'next/image';
import useModal from '@/hooks/useModal';
import Modal from './Modal';
import NewBookingForm from './NewBookingForm';
import { useState } from 'react';

type ProfessionalsListProps = {
  professionals?: User[];
};

export default function ProfessionalsList({ professionals }: ProfessionalsListProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedPro, setSelectedPro] = useState<User | null>(null);

  const handleNewAppointment = (pro: User) => {
    setSelectedPro(pro);
    openModal();
  };

  return (
    <>
      <ul className='grid grid-cols-5 gap-5'>
        {professionals?.map((professional) => (
          <li
            key={professional.id}
            className='flex text-center flex-col justify-center items-center gap-5 bg-white rounded-3xl p-4'
          >
            <Link href={`/professionals/${professional.id}`} className='flex flex-col items-center'>
              <Image
                width={125}
                height={125}
                src={`https://i.pravatar.cc/150?img=${professional.id}`}
                alt='Avatar'
                className='rounded-full mb-3'
              />

              {/* Nom et profession */}
              <h3 className='text-2xl font-semibold'>
                {professional.firstName} {professional.lastName}
              </h3>

              <h4 className='text-lg text-gray-600'>{professional.profession}</h4>
            </Link>

            {/* Adresse */}
            {professional.street && professional.city && (
              <p className='text-lg text-gray-500'>{professional.city}</p>
            )}

            <ActionButton
              text='New Appointment'
              icon='+'
              onClick={() => handleNewAppointment(professional)}
            />
          </li>
        ))}
      </ul>

      {selectedPro && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={`New Appointment - ${selectedPro.firstName} ${selectedPro.lastName}`}
        >
          <NewBookingForm professionalId={selectedPro.id} />
        </Modal>
      )}
    </>
  );
}
