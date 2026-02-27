import useFetchProAvailabilities from '@/hooks/useFetchProAvailabilities';
import { getLoggedUser } from '@/utils/utils';
import ActionButton from './ActionButton';
import { PlusIcon } from '@heroicons/react/24/outline';

const formatDayOfWeek = (dayOfWeek: number) =>
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];

export default function ProAvailabilities() {
  const userId = getLoggedUser()?.id ?? 0;
  const { availabilities } = useFetchProAvailabilities(userId);

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
    </>
  );
}
