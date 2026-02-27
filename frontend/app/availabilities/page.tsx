'use client';

import ProAvailabilities from '@/components/ProAvailabilities';
import ProfessionalsList from '@/components/ProfessionalsList';
import { getLoggedUser } from '@/utils/utils';

export default function AvailabilitiesPage() {
  const userRole = getLoggedUser()?.role;

  return (
    <section className='space-y-6'>
      {userRole === 'customer' || (userRole === 'superAdmin' && <ProfessionalsList />)}
      {userRole === 'professional' && <ProAvailabilities />}
    </section>
  );
}
