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

      <label className='flex flex-col gap-1.5'>
        <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
          Description
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Message optionnel pour le professionnel...'
          rows={3}
          className='text-sm text-gray-700 placeholder:text-gray-300 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition-all'
        />
      </label>

      <button
        type='submit'
        disabled={isPending}
        className='w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all'
      >
        {isPending ? (
          <span className='flex items-center justify-center gap-2'>
            <svg className='w-4 h-4 animate-spin' viewBox='0 0 24 24' fill='none'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
              />
            </svg>
            Réservation...
          </span>
        ) : (
          'Créer le rendez-vous'
        )}
      </button>

      {isSuccess && <p className='text-center'>Booking created successfully!</p>}
      {isError && <p>Failed to create booking. Please try again.</p>}
    </form>
  );
}
