import Link from 'next/link';

export default function Header() {
  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link href='/'>Dashboard</Link>
        <Link href='/availabilities'>Availabilities</Link>
        <Link href='/appointments'>Appointments</Link>
      </nav>
    </header>
  );
}
