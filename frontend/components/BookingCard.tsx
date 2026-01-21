import { Booking, BookingStatus } from '@backend/controllers/booking.controller';

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const { customerId, professionalId, selectedDate, selectedHour, status, description, createdAt } =
    booking;

  const statusColors: Record<BookingStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
  };

  return (
    <div className='border rounded-xl shadow-sm p-4 bg-white flex flex-col gap-2 w-full max-w-md'>
      {/* Header: client + professional */}
      <div className='flex justify-between items-center'>
        <div>
          <p className='font-semibold'>{customerId}</p>
          <p className='text-gray-500 text-sm'>{professionalId}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Date + Heure */}
      <div className='text-sm text-gray-700'>
        <p>
          📅 {new Date(selectedDate).toLocaleDateString('fr-FR')} à {selectedHour.slice(0, 5)}
        </p>
      </div>

      {/* Description */}
      {description && (
        <p className='text-gray-600 text-sm italic border-l-2 border-gray-200 pl-2'>
          &quot;{description}&quot;
        </p>
      )}

      {/* Créé le */}
      <p className='text-gray-400 text-xs'>
        Créé le {new Date(createdAt).toLocaleDateString('fr-FR')} à{' '}
        {new Date(createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}
