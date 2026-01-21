import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Heures sélectionnables (BookEasy-friendly)
const HOURS = Array.from({ length: 12 }, (_, i) => `${8 + i}:00`); // 08:00 → 19:00

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // JS: dimanche = 0 → on décale pour commencer lundi
  const startOffset = (firstDay.getDay() + 6) % 7;

  const days: (Date | null)[] = [];

  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

type CalendarProps = {
  selectedDate: Date | null;
  selectedHour: string | null;
  onSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  onSelectedHour: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Calendar({
  selectedDate,
  onSelectedDate,
  selectedHour,
  onSelectedHour,
}: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getMonthDays(year, month);

  const goPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  return (
    <div className='w-full max-w-md space-y-4 rounded-2xl bg-white p-4 shadow-sm'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <button onClick={goPrevMonth} className='rounded-lg p-2 hover:bg-gray-100'>
          <ChevronLeftIcon className='h-5 w-5' />
        </button>

        <h2 className='text-lg font-semibold capitalize'>
          {currentDate.toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>

        <button onClick={goNextMonth} className='rounded-lg p-2 hover:bg-gray-100'>
          <ChevronRightIcon className='h-5 w-5' />
        </button>
      </div>

      {/* Days header */}
      <div className='grid grid-cols-7 gap-2 text-center text-sm text-gray-500'>
        {DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className='grid grid-cols-7 gap-2'>
        {days.map((date, index) => {
          if (!date) return <div key={index} />;

          const dateCopy = new Date(date);
          dateCopy.setHours(0, 0, 0, 0);

          const isPastDate = dateCopy < today;
          const isSelected = selectedDate && isSameDay(selectedDate, date);
          const isToday = isSameDay(new Date(), date);

          return (
            <button
              key={index}
              type='button'
              onClick={() => {
                onSelectedDate(date);
                onSelectedHour(null); // reset heure
              }}
              disabled={isPastDate}
              className={`flex h-10 items-center justify-center rounded-lg text-sm transition
                ${isSelected ? 'bg-black text-white' : 'hover:bg-gray-100'}
                ${isToday && !isSelected ? 'bg-blue-100' : ''} ${isPastDate ? 'text-gray-400 pointer-events-none' : ''} `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Time selection */}
      {selectedDate && (
        <div className='space-y-2'>
          <p className='text-sm font-medium text-gray-700'>
            Heures disponibles – {selectedDate.toLocaleDateString('fr-FR')}
          </p>

          <div className='grid grid-cols-4 gap-2'>
            {HOURS.map((hour) => {
              const isSelected = selectedHour === hour;

              // Bloquer les heures passées si la date est aujourd'hui
              let isPastHour = false;
              const today = new Date();
              if (selectedDate) {
                const selDate = new Date(selectedDate);
                selDate.setHours(0, 0, 0, 0);

                const isToday =
                  selDate.getFullYear() === today.getFullYear() &&
                  selDate.getMonth() === today.getMonth() &&
                  selDate.getDate() === today.getDate();

                if (isToday) {
                  const [h, m] = hour.split(':').map(Number);
                  if (h < today.getHours() || (h === today.getHours() && m <= today.getMinutes())) {
                    isPastHour = true;
                  }
                }
              }

              return (
                <button
                  key={hour}
                  type='button'
                  onClick={() => onSelectedHour(hour)}
                  disabled={isPastHour}
                  className={`rounded-lg border px-2 py-1 text-sm transition
              ${isSelected ? 'bg-black text-white' : 'hover:bg-gray-100'}
              ${isPastHour ? 'text-gray-400 pointer-events-none' : ''}`}
                >
                  {hour}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Résumé */}
      {selectedDate && selectedHour && (
        <div className='rounded-lg bg-gray-50 p-2 text-sm text-gray-700'>
          Sélection :{' '}
          <strong>
            {selectedDate.toLocaleDateString('fr-FR')} à {selectedHour}
          </strong>
        </div>
      )}
    </div>
  );
}
