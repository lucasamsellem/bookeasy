import { Availability } from '@/types/availability';

type Props = {
  availability: Availability;
};

export default function AvailabilityCard({ availability }: Props) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: 4 }}>
      <strong>{availability.date}</strong>
      <p>
        {availability.startTime} – {availability.endTime}
      </p>
      <p>Status: {availability.isAvailable ? 'Available' : 'Booked'}</p>
    </div>
  );
}
