'use client';

import ProAvailabilities from '@/features/availabilities/components/ProAvailabilities';
import ProfessionalsList from '@/features/users/components/ProfessionalsList';
import { getLoggedUser } from '@/utils/utils';

export default function AvailabilitiesPage() {
  const userRole = getLoggedUser()?.role;

  if (!userRole || userRole === 'customer' || userRole === 'superAdmin')
    return (
      <section className='space-y-6 p-10'>
        <ProfessionalsList />
      </section>
    );

  if (userRole === 'professional')
    return (
      <section className='space-y-6 p-10'>
        <ProAvailabilities />
      </section>
    );

  return <section className='space-y-6'></section>;
}
