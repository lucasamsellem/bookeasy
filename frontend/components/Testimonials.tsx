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
    <section className='w-full max-w-5xl mt-16'>
      <h2 className='text-2xl font-semibold text-center mb-8'>Ce que nos utilisateurs disent</h2>
      <div className='grid gap-6 md:grid-cols-3'>
        {testimonials.map((t, i) => (
          <div
            key={i}
            className='bg-white shadow-lg rounded-xl p-6 flex flex-col items-start hover:scale-105 transition-transform'
          >
            <p className='text-gray-700 mb-4'>“{t.text}”</p>
            <span className='font-semibold'>{t.name}</span>
            <span className='text-sm text-gray-500'>{t.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
