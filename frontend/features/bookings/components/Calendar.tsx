import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Availability } from '@/types/types';
import { toDateKey } from '@/hooks/availabilities/useFetchProAvailabilities';
import './Calendar.scss';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const HOURS = Array.from({ length: 12 }, (_, i) => `${String(8 + i).padStart(2, '0')}:00`);

type CalendarProps = {
  selectedDate: string | null;
  selectedHour: string | null;
  onSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  onSelectedHour: React.Dispatch<React.SetStateAction<string | null>>;
  availabilities: Availability[];
  bookedHours: { date: string; selectedHour: string }[];
};

// ---- Helpers ----
function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const days: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

function hourToMinutes(h: string) {
  const [hh, mm] = h.split(':').map(Number);
  return hh * 60 + mm;
}

/**
 * Pour une date donnée, renvoie les heures (parmi HOURS) couvertes
 * par au moins un créneau de disponibilité.
 */
function getAvailableHours(
  dateKey: string,
  availabilities: Availability[],
  bookedHours: { date: string; selectedHour: string }[], // 👈
): Set<string> {
  const slots = availabilities.filter((a) => a.date === dateKey);
  const booked = new Set(
    bookedHours.filter((b) => b.date === dateKey).map((b) => b.selectedHour.slice(0, 5)), // "10:00:00" → "10:00"
  );
  const available = new Set<string>();

  for (const slot of slots) {
    const start = hourToMinutes(slot.startHour);
    const end = hourToMinutes(slot.endHour);
    for (const hour of HOURS) {
      const h = hourToMinutes(hour);
      if (h >= start && h < end && !booked.has(hour)) {
        // 👈
        available.add(hour);
      }
    }
  }

  return available;
}

export default function Calendar({
  selectedDate,
  onSelectedDate,
  selectedHour,
  onSelectedHour,
  availabilities,
  bookedHours,
}: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = toDateKey(today);

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getMonthDays(year, month);

  const daysWithAvailability = new Set(
    availabilities
      .map((a) => a.date)
      .filter((dateKey) => getAvailableHours(dateKey, availabilities, bookedHours).size > 0),
  );

  const availableHours = selectedDate
    ? getAvailableHours(selectedDate, availabilities, bookedHours)
    : new Set<string>();

  return (
    <div className='calendar'>
      {/* Header */}
      <div className='calendar__header'>
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className='calendar__nav'
        >
          <ChevronLeftIcon className='calendar__icon' />
        </button>

        <h2 className='calendar__title'>
          {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </h2>

        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className='calendar__nav'
        >
          <ChevronRightIcon className='calendar__icon' />
        </button>
      </div>

      {/* Days header */}
      <div className='calendar__days'>
        {DAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className='calendar__grid'>
        {days.map((date, index) => {
          if (!date) return <div key={index} />;

          const dateCopy = new Date(date);
          dateCopy.setHours(0, 0, 0, 0);

          const dateKey = toDateKey(date);
          const isPast = dateCopy < today;
          const hasSlots = daysWithAvailability.has(dateKey);
          const isDisabled = isPast || !hasSlots;
          const isSelected = selectedDate === dateKey;
          const isToday = dateKey === todayKey;

          return (
            <button
              key={index}
              type='button'
              onClick={() => {
                onSelectedDate(toDateKey(date));
                onSelectedHour(null);
              }}
              disabled={isDisabled}
              className={`
                calendar__day
                ${isSelected ? 'calendar__day--selected' : ''}
                ${isToday ? 'calendar__day--today' : ''}
                ${isDisabled ? 'calendar__day--disabled' : ''}
              `}
            >
              {date.getDate()}

              {hasSlots && !isPast && !isSelected && <span className='calendar__dot' />}
            </button>
          );
        })}
      </div>

      {/* Hours */}
      {selectedDate && (
        <div className='calendar__hours'>
          <p className='calendar__hours-label'>
            Heures disponibles –{' '}
            {(() => {
              const [y, m, d] = selectedDate.split('-').map(Number);
              return new Date(y, m - 1, d).toLocaleDateString('fr-FR');
            })()}
          </p>

          <div className='calendar__hours-grid'>
            {HOURS.map((hour) => {
              const isSelected = selectedHour === hour;
              const isAvailable = availableHours.has(hour);

              let isPastHour = false;
              if (selectedDate === todayKey) {
                const [h] = hour.split(':').map(Number);
                isPastHour = h <= new Date().getHours();
              }

              const isDisabled = !isAvailable || isPastHour;

              return (
                <button
                  key={hour}
                  type='button'
                  onClick={() => onSelectedHour(hour)}
                  disabled={isDisabled}
                  className={`
                    calendar__hour
                    ${isSelected ? 'calendar__hour--selected' : ''}
                    ${isDisabled ? 'calendar__hour--disabled' : ''}
                  `}
                >
                  {hour}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {selectedDate && selectedHour && (
        <div className='calendar__summary'>
          Sélection :{' '}
          <strong>
            {(() => {
              const [y, m, d] = selectedDate.split('-').map(Number);
              return new Date(y, m - 1, d).toLocaleDateString('fr-FR');
            })()}{' '}
            à {selectedHour}
          </strong>
        </div>
      )}
    </div>
  );
}
