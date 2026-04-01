import Logo from '@/components/Logo';

export default function AboutPage() {
  return (
    <article className='max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg my-10'>
      {/* Header */}
      <div className='flex items-start justify-between gap-4 mb-10'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 leading-tight'>À propos de BookEasy</h1>
          <p className='text-sm text-gray-500 mt-1'>
            Simplifier la gestion des rendez-vous pour tous
          </p>
        </div>
        <Logo size={80} />
      </div>

      <hr className='border-gray-100 mb-8' />

      {/* Le problème */}
      <section className='mb-8'>
        <p className='text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3'>
          Le problème
        </p>
        <p className='text-gray-600 leading-relaxed'>
          De nombreux professionnels gèrent encore leurs rendez-vous à l&apos;aide de carnets, de
          feuilles Excel ou de messages. Cela entraîne des erreurs, des oublis et une perte de temps
          importante — pour les prestataires comme pour leurs clients.
        </p>
      </section>

      <hr className='border-gray-100 mb-8' />

      {/* Notre solution */}
      <section className='mb-8'>
        <p className='text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3'>
          Notre solution
        </p>
        <p className='text-gray-600 leading-relaxed mb-3'>
          BookEasy est né d&apos;une idée simple : simplifier la gestion des rendez-vous pour tous
          les types de prestataires, qu&apos;il s&apos;agisse de professionnels de santé, coachs,
          artisans ou services de proximité.
        </p>
        <p className='text-gray-600 leading-relaxed'>
          Notre mission est de rendre la prise de rendez-vous rapide, intuitive et accessible — tant
          pour les prestataires que pour leurs clients.
        </p>

        {/* Feature cards */}
        <div className='grid grid-cols-3 gap-3 mt-5'>
          {[
            { icon: '📅', text: 'Organisez votre emploi du temps efficacement' },
            { icon: '⚡', text: 'Vos clients réservent en quelques clics' },
            { icon: '✓', text: 'Réduisez les rendez-vous manqués' },
          ].map(({ icon, text }) => (
            <div key={text} className='bg-gray-50 rounded-lg border border-gray-100 p-4'>
              <div className='text-base mb-2'>{icon}</div>
              <p className='text-sm text-gray-500 leading-snug'>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <div className='bg-gray-50 rounded-lg border border-gray-100 px-6 py-5'>
        <p className='text-sm text-gray-500 leading-relaxed'>
          Nous croyons qu&apos;une bonne organisation améliore l&apos;expérience de tous. BookEasy
          est là pour vous y aider.
        </p>
      </div>
    </article>
  );
}
