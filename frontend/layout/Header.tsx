'use client';

import Link from 'next/link';
import { getLoggedUser } from '@/utils/utils';
import { usePathname } from 'next/navigation';
import { apiFetch } from '@/services/api';
import Logo from '@/components/Logo';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Separator from '@/components/Separator';

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

        {!loggedUser && (
          <div className='flex gap-x-5'>
            <NavLink href='/login'>Login</NavLink>
            <NavLink href='/register'>Register</NavLink>
          </div>
        )}

        {loggedUser && (
          <div className='flex'>
            <p className='flex items-center gap-x-2'>
              {<UserCircleIcon className='size-8' />}
              {loggedUser.firstName} {loggedUser.lastName} ({loggedUser.role})
            </p>

            <Separator orientation='vertical' className=' mx-4' />

            <button onClick={logout}>Logout</button>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        relative px-1 text-md font-medium transition-colors
        ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}
      `}
    >
      {children}

      <span
        className={`
          absolute left-0 -bottom-1 h-0.5 w-full rounded bg-blue-600 transition-all
          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}
      />
    </Link>
  );
}
