'use client';

import Link from 'next/link';

export default function Header() {
  const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <nav className='flex justify-between'>
        <div className='flex gap-x-5'>
          <Link href='/'>Dashboard</Link>
          <Link href='/availabilities'>Availabilities</Link>
          <Link href='/appointments'>Appointments</Link>
        </div>

        {loggedUser.name && <p>Welcome, {loggedUser.name}</p>}

        <div>
          <Link href='/login'>Login</Link>
        </div>
      </nav>
    </header>
  );
}
