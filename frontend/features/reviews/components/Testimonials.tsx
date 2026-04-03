import Avatar from '../../users/components/Avatar';
import styles from './Testimonials.module.scss';

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
    <section className={styles.testimonials}>
      <h2>Ce que nos utilisateurs disent</h2>
      <div className={styles['grid-container']}>
        {testimonials.map((t, i) => (
          <div key={i} className={styles['testimonial-card']}>
            <div className={styles.header}>
              <Avatar id={i} size={80} />
              <div className={styles.info}>
                <span className={styles.name}>{t.name}</span>
                <span className={styles.role}>{t.role}</span>
              </div>
            </div>

            <p className={styles.text}>“{t.text}”</p>
          </div>
        ))}
      </div>
    </section>
  );
}
