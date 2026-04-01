'use client';

import ActionButton from '@/components/ActionButton';
import FeaturesList from '@/components/FeaturesList';
import { redirect } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Testimonials from '@/components/Testimonials';
import Logo from '@/components/Logo';
import './HomePage.scss';

export default function HomePage() {
  return (
    <div className='home'>
      {/* Hero */}
      <section className='hero'>
        <div className='hero__blur' />

        <Logo size={200} />

        <div className='hero__content'>
          <h1 className='hero__title'>
            Réservez vos services <span>en toute simplicité</span>
          </h1>
          <p className='hero__subtitle'>
            Trouvez le professionnel qu&apos;il vous faut et prenez rendez-vous en quelques clics.
          </p>
        </div>

        <ActionButton
          text='Trouver un professionnel'
          onClick={() => redirect('/availabilities')}
          icon={<MagnifyingGlassIcon className='hero__icon' />}
        />
      </section>

      <FeaturesList />
      <Testimonials />
    </div>
  );
}
