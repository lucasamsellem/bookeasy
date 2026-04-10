// components/BookingForm.tsx
import { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/services/api';
import { getLoggedUser } from '@/utils/utils';
import Calendar from './Calendar';
import useFetchProAvailabilities from '@/features/availabilities/hooks/useFetchProAvailabilities';
import ActionButton from '@/components/ActionButton';
import { CalendarIcon } from '@heroicons/react/24/solid';

interface BookingFormProps {
  professionalId: number;
}

interface BookingPayload {
  customerId: number;
  professionalId: number;
  selectedDate: string;
  selectedHour: string;
  description?: string;
}

export default function BookingForm({ professionalId }: BookingFormProps) {
  const customerId = getLoggedUser()?.id;
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  // Fetch availabilities
  const { availabilities, bookedHours } = useFetchProAvailabilities(professionalId);

  // Create booking
  const { mutateAsync, isPending, isSuccess, isError } = useMutation({
    mutationFn: (payload: BookingPayload) =>
      apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!customerId || !selectedDate || !selectedHour) return;

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
        availabilities={availabilities ?? []}
        bookedHours={bookedHours}
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

      <ActionButton
        type='submit'
        isLoading={isPending}
        icon={customerId ? <CalendarIcon className='size-5' /> : undefined}
        disabled={!customerId || !selectedDate || !selectedHour}
        text={
          isPending ? 'Réservation...' : !customerId ? 'Connexion requise' : 'Créer le rendez-vous'
        }
      />

      {isSuccess && <p className='text-center'>Booking created successfully!</p>}
      {isError && <p>Failed to create booking. Please try again.</p>}
    </form>
  );
}
