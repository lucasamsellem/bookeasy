'use client';

import { Professional } from '@/app/appointments/page';
import { apiFetch } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Spinner from '@/components/Spinner';
import ActionButton from '@/components/ActionButton';

export default function ProfessionalPage() {
  const { id } = useParams();

  const { data: professional, isLoading } = useQuery<Professional>({
    queryKey: ['professional', id],
    queryFn: () => apiFetch(`/users/${id}`),
  });

  const handleNewAppointment = () => {};

  if (!professional) {
    return <p>Professionnel introuvable.</p>;
  }

  if (isLoading) {
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
        <ActionButton text='New Appointment' icon='+' onClick={handleNewAppointment} />
      </footer>
    </div>
  );
}
