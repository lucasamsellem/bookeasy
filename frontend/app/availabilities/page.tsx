import AvailabilityCard from '@/components/AvailabilityCard';
import { Availability } from '@/types/availability';

const mockAvailabilities: Availability[] = [
  {
    id: 1,
    date: '2025-01-10',
    startTime: '09:00',
    endTime: '10:00',
    isAvailable: true,
  },
  {
    id: 2,
    date: '2025-01-10',
    startTime: '10:00',
    endTime: '11:00',
    isAvailable: false,
  },
];

export default function AvailabilitiesPage() {
  return (
    <section>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {mockAvailabilities.map((availability) => (
          <AvailabilityCard key={availability.id} availability={availability} />
        ))}
      </div>
    </section>
  );
}
