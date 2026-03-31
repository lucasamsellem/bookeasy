'use client';

import ActionButton from '@/components/ActionButton';
import FeaturesList from '@/components/FeaturesList';
import { redirect } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Testimonials from '@/components/Testimonials';
import Logo from '@/components/Logo';

export default function HomePage() {
  return (
    <div className='flex flex-col items-center'>
      {/* Hero */}
      <section className='relative flex flex-col items-center gap-y-8 px-4 py-24 text-center w-full bg-linear-to-b from-slate-50 to-white'>
        {/* Cercle décoratif flou derrière le logo */}
        <div className='absolute top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-slate-200 rounded-full blur-3xl opacity-40 pointer-events-none' />

        <Logo size={200} />

        <div className='flex flex-col items-center gap-y-4 max-w-xl'>
          <h1 className='text-4xl md:text-5xl font-bold text-slate-900 leading-tight'>
            Réservez vos services <span className='text-slate-500'>en toute simplicité</span>
          </h1>
          <p className='text-sm text-slate-500 leading-relaxed'>
            Trouvez le professionnel qu&apos;il vous faut et prenez rendez-vous en quelques clics.
          </p>
        </div>

        <ActionButton
          text='Trouver un professionnel'
          onClick={() => redirect('/availabilities')}
          icon={<MagnifyingGlassIcon className='h-5 w-5' />}
        />
      </section>

      {/* Features */}
      <FeaturesList />

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}
