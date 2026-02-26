'use client';

import Link from 'next/link';
import { getLoggedUser } from '@/utils/utils';
import { usePathname } from 'next/navigation';
import { apiFetch } from '@/services/api';
import Logo from '@/components/Logo';

export default function Header() {
  const loggedUser = getLoggedUser();

  const logout = async () => {
    await apiFetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <nav className='flex justify-between items-center'>
        <div className='flex gap-x-5 items-center'>
          <Logo size={40} />
          <NavLink href='/'>Home</NavLink>
          {loggedUser?.role === 'superAdmin' && <NavLink href='/dashboard'>Dashboard</NavLink>}
          <NavLink href='/availabilities'>Availabilities</NavLink>
          <NavLink href='/appointments'>My appointments</NavLink>
          <NavLink href='/about'>About</NavLink>
        </div>

        {loggedUser && (
          <p>
            Welcome, {loggedUser.firstName} {loggedUser.lastName} ({loggedUser.role})
          </p>
        )}

        {!loggedUser && (
          <div className='flex gap-x-5'>
            <NavLink href='/login'>Login</NavLink>
            <NavLink href='/register'>Register</NavLink>
          </div>
        )}

        {loggedUser && <button onClick={logout}>Logout</button>}
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={isActive ? 'text-blue-600 font-semibold' : 'text-gray-600'}>
      {children}
    </Link>
  );
}
