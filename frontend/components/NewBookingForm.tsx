// components/BookingForm.tsx
import { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { getLoggedUser } from '@/utils/utils';

interface BookingFormProps {
  professionalId: number;
}

interface BookingPayload {
  customerId: number;
  professionalId: number;
  startTime: string;
  endTime: string;
  description?: string;
}

export default function BookingForm({ professionalId }: BookingFormProps) {
  const customerId = getLoggedUser()?.id;
  const queryClient = useQueryClient();

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: (payload: BookingPayload) =>
      apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  });

  if (!customerId) return <p>Please log in to book a session.</p>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!startTime || !endTime) return;

    try {
      await mutateAsync({
        customerId,
        professionalId,
        startTime,
        endTime,
        description,
      });

      // Success actions
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setStartTime('');
      setEndTime('');
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
      <label>
        Start Time
        <input
          type='datetime-local'
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className='border p-2 w-full'
        />
      </label>

      <label>
        End Time
        <input
          type='datetime-local'
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className='border p-2 w-full'
        />
      </label>

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
        className='bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
      >
        {isPending ? 'Booking...' : 'Create Booking'}
      </button>

      {isSuccess && <p className='text-center'>Booking created successfully!</p>}
      {isError && <p>Failed to create booking. Please try again.</p>}
    </form>
  );
}
