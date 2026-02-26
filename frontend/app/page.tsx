'use client';

import ActionButton from '@/components/ActionButton';
import FeaturesList from '@/components/FeaturesList';
import { redirect } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Testimonials from '@/components/Testimonials';
import Logo from '@/components/Logo';

export default function HomePage() {
  return (
    <div className='flex flex-col items-center gap-y-10 px-4 md:px-20'>
      <section className='flex flex-col items-center gap-y-10'>
        {/* Accroche */}
        <h1 className='text-center text-4xl font-bold mt-10'>
          Réservez vos services en toute simplicité
        </h1>

        <Logo size={200} />

        {/* CTA */}
        <ActionButton
          text='Trouver un professionnel'
          onClick={() => redirect('/availabilities')}
          icon={<MagnifyingGlassIcon className='h-6 w-6' />}
        />
      </section>

      {/* Liste des fonctionnalités */}
      <FeaturesList />

      {/* Section Témoignages */}
      <Testimonials />
    </div>
  );
}
