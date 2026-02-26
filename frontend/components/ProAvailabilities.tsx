import useFetchProAvailabilities from '@/hooks/useFetchProAvailabilities';
import { getLoggedUser } from '@/utils/utils';

const formatDayOfWeek = (dayOfWeek: number) =>
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];

export default function ProAvailabilities() {
  const userId = getLoggedUser()?.id ?? 0;
  const { availabilities } = useFetchProAvailabilities(userId);

  return (
    <ul>
      {availabilities?.map((availability) => (
        <li key={availability.id}>
          {formatDayOfWeek(availability.dayOfWeek)} {availability.startHour}-{availability.endHour}
        </li>
      ))}
    </ul>
  );
}
