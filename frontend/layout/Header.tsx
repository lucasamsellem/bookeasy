'use client';

import Link from 'next/link';
import { getLoggedUser } from '@/utils/utils';
import { usePathname } from 'next/navigation';
import { apiFetch } from '@/services/api';
import Logo from '@/components/Logo';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Separator from '@/components/Separator';
import { useState } from 'react';

export default function Header() {
  const loggedUser = getLoggedUser();
  const isPro = loggedUser?.role === 'professional';
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await apiFetch('/auth/logout', {
      method: 'POST',
    });

    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className='border-b border-gray-200 px-4 py-3 bg-white'>
      <nav className='flex items-center justify-between'>
        {/* Logo */}
        <Logo size={36} />

        {/* Desktop navigation */}
        <div className='hidden md:flex items-center gap-x-6'>
          <NavLink href='/'>Home</NavLink>

          {loggedUser?.role === 'superAdmin' && <NavLink href='/dashboard'>Dashboard</NavLink>}

          <NavLink href='/availabilities'>{isPro ? 'My' : ''} Availabilities</NavLink>

          {loggedUser && <NavLink href='/bookings'>My Bookings</NavLink>}

          <NavLink href='/about'>About</NavLink>
        </div>

        {/* Right side desktop */}
        <div className='hidden md:flex items-center'>
          {!loggedUser && (
            <div className='flex gap-x-4'>
              <NavLink href='/login'>Login</NavLink>
              <NavLink href='/register'>Register</NavLink>
            </div>
          )}

          {loggedUser && (
            <div className='flex items-center'>
              <p className='flex items-center gap-x-2 text-sm text-gray-700'>
                <UserCircleIcon className='size-7 text-gray-500' />
                {loggedUser.firstName} {loggedUser.lastName}
              </p>

              <Separator orientation='vertical' className='mx-4 h-6' />

              <button
                onClick={logout}
                className='text-sm text-gray-600 hover:text-red-600 transition'
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setOpen(!open)} className='md:hidden'>
          {open ? (
            <XMarkIcon className='size-7 text-gray-700' />
          ) : (
            <Bars3Icon className='size-7 text-gray-700' />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className='flex flex-col gap-3 mt-4 md:hidden'>
          <NavLink href='/'>Home</NavLink>

          {loggedUser?.role === 'superAdmin' && <NavLink href='/dashboard'>Dashboard</NavLink>}

          <NavLink href='/availabilities'>Availabilities</NavLink>
          <NavLink href='/bookings'>My Bookings</NavLink>
          <NavLink href='/about'>About</NavLink>

          <Separator className='my-2' />

          {!loggedUser && (
            <>
              <NavLink href='/login'>Login</NavLink>
              <NavLink href='/register'>Register</NavLink>
            </>
          )}

          {loggedUser && (
            <>
              <div className='flex items-center gap-2 text-sm text-gray-700'>
                <UserCircleIcon className='size-7 text-gray-500' />
                {loggedUser.firstName} {loggedUser.lastName}
              </div>

              <button onClick={logout} className='text-left text-sm text-red-600'>
                Logout
              </button>
            </>
          )}
        </div>
      )}
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
        relative text-sm font-medium transition-colors
        ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}
      `}
    >
      {children}
    </Link>
  );
}
