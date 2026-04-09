import { forwardRef, useState } from 'react';
import type { Availability } from '@/types/types';

interface AvailabilityFormProps {
  professionalId: number;
  onSubmit: (values: Availability) => Promise<void>;
}

const AvailabilityForm = forwardRef<HTMLFormElement, AvailabilityFormProps>(
  ({ professionalId, onSubmit }, ref) => {
    const [date, setDate] = useState<string>('');
    const [startHour, setStartHour] = useState('09:00');
    const [endHour, setEndHour] = useState('17:00');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await onSubmit({ professionalId, date, startHour, endHour });
    };

    const inputClass =
      'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition-all';

    const labelClass = 'flex flex-col gap-1.5';
    const labelTextClass = 'text-xs font-semibold text-gray-500 uppercase tracking-wider';

    return (
      <form className='space-y-4' onSubmit={handleSubmit} ref={ref}>
        <label className={labelClass}>
          <span className={labelTextClass}>Date</span>
          <input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            required
          />
        </label>

        <div className='grid grid-cols-2 gap-3'>
          <label className={labelClass}>
            <span className={labelTextClass}>Début</span>
            <input
              type='time'
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className={inputClass}
              required
            />
          </label>

          <label className={labelClass}>
            <span className={labelTextClass}>Fin</span>
            <input
              type='time'
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              className={inputClass}
              required
            />
          </label>
        </div>
      </form>
    );
  },
);

AvailabilityForm.displayName = 'AvailabilityForm';
export default AvailabilityForm;
