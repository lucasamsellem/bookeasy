import { useState } from 'react';
import type { Availability } from '@/types/availability';

interface AvailabilityFormProps {
  professionalId: number;
  onSubmit: (values: Availability) => Promise<void>;
}

export default function AvailabilityForm({ professionalId, onSubmit }: AvailabilityFormProps) {
  const [date, setDate] = useState<string>('');
  const [startHour, setStartHour] = useState('09:00');
  const [endHour, setEndHour] = useState('17:00');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ professionalId, date, startHour, endHour });
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit}>
      <label>
        Date
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className='block w-full rounded-md border border-gray-300 p-2'
          required
        />
      </label>

      <label>
        Heure de début
        <input
          type='time'
          value={startHour}
          onChange={(e) => setStartHour(e.target.value)}
          className='block w-full rounded-md border border-gray-300 p-2'
          required
        />
      </label>

      <label>
        Heure de fin
        <input
          type='time'
          value={endHour}
          onChange={(e) => setEndHour(e.target.value)}
          className='block w-full rounded-md border border-gray-300 p-2'
          required
        />
      </label>

      <button
        type='submit'
        className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700'
      >
        Ajouter
      </button>
    </form>
  );
}
