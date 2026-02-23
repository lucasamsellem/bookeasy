// components/BookingForm.tsx
import { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { getLoggedUser } from '@/utils/utils';
import Calendar from './Calendar';

interface BookingFormProps {
  professionalId: number;
}

interface BookingPayload {
  customerId: number;
  professionalId: number;
  selectedDate: Date;
  selectedHour: string;
  description?: string;
}

export default function BookingForm({ professionalId }: BookingFormProps) {
  const token = localStorage.getItem('token');
  const customerId = getLoggedUser()?.id;
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: (payload: BookingPayload) =>
      apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { Authorization: `Bearer ${token}` },
      }),
  });

  if (!customerId) return <p>Please log in to book a session.</p>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedHour) return;

    try {
      await mutateAsync({
        customerId,
        professionalId,
        selectedDate,
        selectedHour,
        description,
      });

      // Success actions
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setSelectedDate(null);
      setSelectedHour(null);
      setDescription('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log('Unknown error', err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full max-w-md'>
      <Calendar
        selectedDate={selectedDate}
        selectedHour={selectedHour}
        onSelectedDate={setSelectedDate}
        onSelectedHour={setSelectedHour}
      />

      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='border p-2 w-full'
          placeholder='Optional message for professional'
        />
      </label>

      <button
        type='submit'
        disabled={isPending}
        className='bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold'
      >
        {isPending ? 'Booking...' : 'Create Booking'}
      </button>

      {isSuccess && <p className='text-center'>Booking created successfully!</p>}
      {isError && <p>Failed to create booking. Please try again.</p>}
    </form>
  );
}
