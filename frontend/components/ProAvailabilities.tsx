import useFetchProAvailabilities from '@/hooks/useFetchProAvailabilities';
import { getLoggedUser } from '@/utils/utils';
import ActionButton from './ActionButton';
import { PlusIcon } from '@heroicons/react/24/outline';
import useFetchUserBookings from '@/hooks/useFetchUserBookings';
import BookingCard from './BookingCard';
import useUpdateBookingStatus from '@/hooks/useUpdateBookingStatus';

const formatDayOfWeek = (dayOfWeek: number) =>
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];

export default function ProAvailabilities() {
  const userId = getLoggedUser()?.id ?? 0;
  const { availabilities } = useFetchProAvailabilities(userId);
  const { userBookings } = useFetchUserBookings(userId);
  const { updateBookingStatus } = useUpdateBookingStatus();

  return (
    <>
      <div>
        <h2>Mes Disponibilités</h2>
        <ActionButton
          text='Ajouter une disponibilité'
          icon={<PlusIcon className='size-5' />}
          onClick={() => {}}
        />
      </div>

      <ul>
        {availabilities?.map((availability) => (
          <li key={availability.id}>
            {formatDayOfWeek(availability.dayOfWeek)} {availability.startHour}-
            {availability.endHour}
          </li>
        ))}
      </ul>

      <h2>Mes créneaux à venir</h2>
      <ul>
        {userBookings?.map((booking) => {
          const isConfirmed = booking.status === 'confirmed';
          const isCanceled = booking.status === 'canceled';

          return (
            <li
              key={booking.id}
              className='w-fit bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm'
            >
              <BookingCard booking={booking} />

              <div className='flex justify-center border-t border-gray-200'>
                <button
                  disabled={isConfirmed}
                  onClick={() => updateBookingStatus({ id: booking.id, status: 'confirmed' })}
                  className={`w-full py-2 transition ${
                    isConfirmed
                      ? 'bg-green-300 cursor-not-allowed! text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }
            `}
                >
                  Confirm
                </button>

                <button
                  disabled={isCanceled}
                  onClick={() => updateBookingStatus({ id: booking.id, status: 'canceled' })}
                  className={`
              w-full py-2 transition
              ${
                isCanceled
                  ? 'bg-red-300 cursor-not-allowed! text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }
            `}
                >
                  Cancel
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
