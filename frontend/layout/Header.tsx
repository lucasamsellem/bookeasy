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
    await apiFetch('/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className='sticky top-0 z-50 border-b border-gray-100 px-6 py-3 bg-white/80 backdrop-blur-md'>
      <nav className='flex items-center justify-between  mx-auto'>
        {/* Logo */}
        <Logo size={40} />

        {/* Desktop navigation */}
        <div className='hidden md:flex items-center gap-x-1'>
          <NavLink href='/'>Home</NavLink>
          {loggedUser?.role === 'superAdmin' && <NavLink href='/dashboard'>Dashboard</NavLink>}
          <NavLink href='/availabilities'>{isPro ? 'My ' : ''}Availabilities</NavLink>
          {loggedUser && <NavLink href='/bookings'>My Bookings</NavLink>}
          <NavLink href='/about'>About</NavLink>
        </div>

        {/* Right side desktop */}
        <div className='hidden md:flex items-center gap-x-3'>
          {!loggedUser && (
            <>
              <Link
                href='/login'
                className='text-sm font-medium text-gray-600 hover:text-gray-900 transition'
              >
                Login
              </Link>
              <Link
                href='/register'
                className='text-sm font-semibold bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:bg-slate-700 transition'
              >
                Register
              </Link>
            </>
          )}

          {loggedUser && (
            <div className='flex items-center gap-x-3'>
              <div className='flex items-center gap-x-2 text-sm text-gray-700'>
                <UserCircleIcon className='size-6 text-gray-400' />
                <span className='font-medium'>
                  {loggedUser.firstName} {loggedUser.lastName}
                </span>
              </div>
              <Separator orientation='vertical' className='h-5' />
              <button
                onClick={logout}
                className='text-sm text-gray-400 hover:text-red-500 transition'
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className='md:hidden p-1 rounded-lg hover:bg-gray-100 transition'
        >
          {open ? (
            <XMarkIcon className='size-6 text-gray-700' />
          ) : (
            <Bars3Icon className='size-6 text-gray-700' />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className='flex flex-col gap-1 mt-3 pb-3 md:hidden border-t border-gray-100 pt-3'>
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
              <div className='flex items-center gap-2 text-sm text-gray-700 px-3 py-2'>
                <UserCircleIcon className='size-5 text-gray-400' />
                {loggedUser.firstName} {loggedUser.lastName}
              </div>
              <button onClick={logout} className='text-left text-sm text-red-500 px-3 py-2'>
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
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
        ${
          isActive
            ? 'bg-slate-100 text-slate-900'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`}
    >
      {children}
    </Link>
  );
}
