import { BookmarkIcon, MapPinIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => (
  <li className='flex flex-col items-center text-center gap-2'>
    {icon}
    <h2 className='font-semibold text-xl'>{title}</h2>
    <h3 className='text-gray-600'>{description}</h3>
  </li>
);

export default async function FeaturesList() {
  const features = [
    {
      icon: <BookmarkIcon className='h-10 w-10' />,
      title: 'Rapide et simple',
      description: 'Réservez en quelques clics, sans attente',
    },
    {
      icon: <MapPinIcon className='h-10 w-10' />,
      title: 'Centralisé',
      description: 'Tous vos rendez-vous dans une seule interface',
    },
    {
      icon: <ShieldCheckIcon className='h-10 w-10' />,
      title: 'Sécurisé',
      description: 'Vos informations sont protégées',
    },
  ];

  return (
    <section>
      <ul className='flex justify-center gap-10'>
        {features.map((f, i) => (
          <Feature key={i} {...f} />
        ))}
      </ul>
    </section>
  );
}
