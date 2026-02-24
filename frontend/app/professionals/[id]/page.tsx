'use client';

import { useParams } from 'next/navigation';
import Spinner from '@/components/Spinner';
import NewBookingForm from '@/components/NewBookingForm';
import useFetchUserById from '@/hooks/useFetchUserById';
import ProfessionalAvatar from '@/components/ProfessionalAvatar';

export default function ProfessionalPage() {
  const { id } = useParams() as { id: string };
  const { user: professional, isUserLoading, userFullName: proFullName } = useFetchUserById(id);

  if (!professional) {
    return <p>Professionnel introuvable.</p>;
  }

  if (isUserLoading) {
    return <Spinner />;
  }

  return (
    <div className='grid grid-cols-2 gap-x-5 max-w-4xl mx-auto p-6'>
      <div className='bg-white rounded-2xl text-center flex flex-col items-center p-4 h-fit'>
        <h1 className='text-2xl font-bold mb-2'>{proFullName}</h1>
        <ProfessionalAvatar professionalId={professional.id} />
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
      </div>

      <NewBookingForm professionalId={professional.id} />
    </div>
  );
}
