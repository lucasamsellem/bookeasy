import useFetchUserById from '@/hooks/useFetchUserById';
import { Booking, BookingStatus } from '@backend/controllers/booking.controller';

interface BookingCardProps {
  booking: Booking;
}

const statusColors: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
};

function buildAppointmentDate(date: Date, hour: string): Date {
  if (!date || !hour) return new Date();
  const [hours, minutes] = hour.split(':').map(Number);

  const appointment = new Date(date);
  appointment.setHours(hours, minutes, 0, 0);

  return appointment;
}

function formatTimeLeft(ms: number): string {
  const totalMinutes = Math.floor(ms / 1000 / 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}j ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}min`;
  return `${minutes}min`;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const { customerId, professionalId, selectedDate, selectedHour, status, description } = booking;

  const { userFullName: customerFullName } = useFetchUserById(customerId);
  const { userFullName: proFullName } = useFetchUserById(professionalId);

  const appointmentDate = buildAppointmentDate(selectedDate!, selectedHour);

  const now = new Date();
  const hasPassed = appointmentDate <= now;
  const timeLeftMs = appointmentDate.getTime() - now.getTime();

  return (
    <div
      className={`rounded-2xl p-4 bg-white flex flex-col gap-2 w-full max-w-md ${
        hasPassed ? 'opacity-50' : ''
      }`}
    >
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <p className='font-semibold'>{proFullName}</p>
          <p className='text-gray-500 text-sm'>{customerFullName}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Date + heure */}
      <div className='text-sm text-gray-700'>
        <p>
          📅 {new Date(selectedDate!).toLocaleDateString('fr-FR')} à {selectedHour.slice(0, 5)}
        </p>
      </div>

      {/* Temps restant */}
      {!hasPassed && status !== 'canceled' && (
        <p className='text-sm text-blue-600 font-medium'>⏳ Dans {formatTimeLeft(timeLeftMs)}</p>
      )}

      {hasPassed && <p className='text-sm text-gray-400 italic'>RDV passé</p>}

      {/* Description */}
      {description && (
        <p className='text-gray-600 text-sm italic border-l-2 border-gray-200 pl-2'>
          &quot;{description}&quot;
        </p>
      )}
    </div>
  );
}
