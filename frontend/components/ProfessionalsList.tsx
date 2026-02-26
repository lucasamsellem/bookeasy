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

      <ul className='grid grid-cols-5 gap-5'>
        {filteredProfessionals?.map((professional) => (
          <li
            key={professional.id}
            className='flex text-center flex-col justify-center items-center gap-5 bg-white rounded-3xl p-4'
          >
            <Link href={`/professionals/${professional.id}`} className='flex flex-col items-center'>
              <Avatar id={professional.id} />

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
