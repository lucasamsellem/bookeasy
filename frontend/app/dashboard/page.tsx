import UsersList from '@/components/UsersList';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/login');

  const payload = JSON.parse(atob(token.split('.')[1]));

  if (payload.role !== 'superAdmin') {
    redirect('/');
  }

  return (
    <div>
      <UsersList />
    </div>
  );
}
