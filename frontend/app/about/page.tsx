import Logo from '@/components/Logo';

export default function AboutPage() {
  return (
    <article className='max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10'>
      <div className='flex items-center justify-between mb-10'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>À propos de BookEasy</h1>
        <Logo size={80} />
      </div>

      <p className='text-gray-700 mb-4'>
        BookEasy est né d&apos;une idée simple : simplifier la gestion des rendez-vous pour tous les
        types de prestataires, qu&apos;il s&apos;agisse de professionnels de santé, coachs, artisans
        ou services de proximité.
      </p>
      <p className='text-gray-700 mb-4'>
        Notre mission est de rendre la prise de rendez-vous rapide, intuitive et accessible, tant
        pour les prestataires que pour leurs clients.
      </p>
      <p className='text-gray-700'>Avec BookEasy, vous pouvez :</p>
      <ul className='list-disc list-inside text-gray-700 mt-2 space-y-1'>
        <li>Organiser votre emploi du temps efficacement</li>
        <li>Permettre à vos clients de réserver en quelques clics</li>
        <li>Gagner du temps et réduire les rendez-vous manqués</li>
      </ul>
      <p className='text-gray-700 mt-4'>
        Nous croyons qu&apos;une bonne organisation améliore l&apos;expérience de tous, et BookEasy
        est là pour vous y aider.
      </p>
    </article>
  );
}
