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
        {userBookings?.map((booking) => (
          <li key={booking.id} className='w-fit bg-white rounded-2xl overflow-hidden flex flex-col'>
            <BookingCard booking={booking} />

            <div className='flex justify-center border-t border-gray-200'>
              <button
                className='bg-green-500 text-white w-full py-2'
                onClick={() => updateBookingStatus({ id: booking.id, status: 'confirmed' })}
              >
                Confirm
              </button>

              <button
                className='bg-red-500 text-white w-full py-2'
                onClick={() => updateBookingStatus({ id: booking.id, status: 'canceled' })}
              >
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
