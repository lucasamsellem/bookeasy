'use client';

import Link from 'next/link';
import { isUserLoggedIn } from '@/utils/utils';
import { usePathname } from 'next/navigation';

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export default function Header() {
  const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = isUserLoggedIn();

  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <nav className='flex justify-between'>
        <div className='flex gap-x-5'>
          <NavLink href='/'>Dashboard</NavLink>
          <NavLink href='/availabilities'>Availabilities</NavLink>
          <NavLink href='/appointments'>Appointments</NavLink>
        </div>

        {loggedUser.name && (
          <p>
            Welcome, {loggedUser.name} ({loggedUser.role})
          </p>
        )}

        {!isLoggedIn && (
          <div className='flex gap-x-5'>
            <NavLink href='/login'>Login</NavLink>
            <NavLink href='/register'>Register</NavLink>
          </div>
        )}

        {isLoggedIn && <button onClick={logout}>Logout</button>}
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
