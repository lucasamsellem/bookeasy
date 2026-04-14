'use client';

import Spinner from '@/components/Spinner';
import ProAvailabilities from '@/features/availabilities/components/ProAvailabilities';
import ProfessionalsList from '@/features/users/components/ProfessionalsList';
import { useUser } from '@/store/useUser';

export default function AvailabilitiesPage() {
  const { user, hasHydrated } = useUser();
  const userRole = user?.role;

  if (!hasHydrated) return <Spinner centered={true} />;

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
