import Link from 'next/link';
import ActionButton from './ActionButton';
import { User } from '@backend/controllers/user.controller';

type ProfessionalsListProps = {
  professionals?: User[];
};

export default function ProfessionalsList({ professionals }: ProfessionalsListProps) {
  const handleNewAppointment = () => {};

  return (
    <ul className='space-y-4'>
      {professionals?.map((professional) => (
        <li key={professional.id}>
          <Link
            href={`/professionals/${professional.id}`}
            className=' flex flex-col p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow'
          >
            <div className='flex justify-between items-start'>
              <div>
                {/* Nom et profession */}
                <h3 className='text-lg font-semibold'>
                  {professional.firstName} {professional.lastName}
                </h3>
                <p className='text-sm text-gray-600'>{professional.profession}</p>
              </div>

              {/* Email */}
              <span className='text-sm text-blue-600 hover:underline'>{professional.email}</span>
            </div>

            {/* Adresse */}
            {professional.street && professional.city && (
              <p className='text-sm text-gray-500 mt-2'>
                {professional.street} {professional.streetNumber || ''}, {professional.city}
              </p>
            )}

            {/* Date de création */}
            <p className='text-xs text-gray-400 mt-1'>
              Membre depuis: {new Date(professional.createdAt).toLocaleDateString()}
            </p>

            <footer>
              <ActionButton text='New Appointment' icon='+' onClick={handleNewAppointment} />
            </footer>
          </Link>
        </li>
      ))}
    </ul>
  );
}
