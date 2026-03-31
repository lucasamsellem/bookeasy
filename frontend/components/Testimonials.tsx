import Avatar from './Avatar';

const testimonials = [
  {
    name: 'Alice M.',
    role: 'Cliente satisfaite',
    text: 'BookEasy a révolutionné ma façon de prendre rendez-vous. Simple, rapide et fiable !',
  },
  {
    name: 'Julien R.',
    role: 'Professionnel',
    text: 'Gérer mes créneaux n’a jamais été aussi facile. Mes clients adorent aussi !',
  },
  {
    name: 'Sophie L.',
    role: 'Cliente régulière',
    text: "Enfin une plateforme qui centralise tous mes rendez-vous et m'évite les oublis.",
  },
];

export default function Testimonials() {
  return (
    <section className='w-full bg-linear-to-b from-white to-slate-50 px-4 py-24 md:px-20'>
      <h2 className='text-4xl font-bold text-slate-900  text-center mb-8'>
        Ce que nos utilisateurs disent
      </h2>
      <div className='grid gap-6 md:grid-cols-3'>
        {testimonials.map((t, i) => (
          <div
            key={i}
            className='bg-white shadow-lg rounded-xl p-6 flex flex-col items-start transition-transform'
          >
            <div className='grid grid-cols-2 items-center gap-x-2 mb-2'>
              <Avatar id={i} size={80} />
              <div className='flex flex-col text-xl'>
                <span className='font-semibold'>{t.name}</span>
                <span className='text-sm text-gray-500'>{t.role}</span>
              </div>
            </div>

            <p className='text-gray-700 mb-4 border-t border-gray-200 pt-4'>“{t.text}”</p>
          </div>
        ))}
      </div>
    </section>
  );
}
