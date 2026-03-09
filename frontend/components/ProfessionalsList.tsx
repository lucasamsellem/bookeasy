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

export default function ProfessionalsList() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedPro, setSelectedPro] = useState<User | null>(null);

  const { data: professionals } = useQuery<User[]>({
    queryKey: ['professionals'],
    queryFn: () => apiFetch('/customers/professionals'),
  });

  const [filters, setFilters] = useState({
    profession: null as string | null,
    name: '',
    location: '',
    // date: '',
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

      // La logique date dépend de ton modèle availability
      const matchDate = true;

      return matchProfession && matchName && matchLocation && matchDate;
    });
  }, [professionals, filters]);

  const handleNewAppointment = (pro: User) => {
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

      <ul
        className='
    grid 
    grid-cols-1 
    gap-4
    
    sm:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-4
  '
      >
        {filteredProfessionals?.map((professional) => (
          <li
            key={professional.id}
            className='
        group
        flex flex-col items-center text-center
        bg-white
        rounded-2xl
        border border-gray-200
        p-6
        transition
        hover:shadow-md
        hover:border-gray-300
      '
          >
            <Link
              href={`/professionals/${professional.id}`}
              className='flex flex-col items-center gap-3'
            >
              <Avatar id={professional.id} />

              <div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {professional.firstName} {professional.lastName}
                </h3>

                <p className='text-sm text-gray-500'>{professional.profession}</p>
              </div>
            </Link>

            {/* Adresse */}
            {professional.street && professional.city && (
              <p className='mt-2 text-sm text-gray-400'>{professional.city}</p>
            )}

            <div className='mt-5 w-full flex justify-center'>
              <ActionButton
                text='New Appointment'
                icon='+'
                onClick={() => handleNewAppointment(professional)}
              />
            </div>
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
