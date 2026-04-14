'use client';

import AllBookings from '@/features/bookings/components/AllBookings';
import AllReviews from '@/features/reviews/components/AllReviews';
import UsersTable from '@/features/users/components/UsersTable';
import { getLoggedUser } from '@/utils/utils';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const user = getLoggedUser();

  if (!user) redirect('/');
  if (user.role !== 'superAdmin') redirect('/');

  return (
    <div className='space-y-10 p-10'>
      <UsersTable />
      <AllBookings />
      <AllReviews />
    </div>
  );
}
