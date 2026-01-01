import { Professional } from '@/app/appointments/page';

type ProfessionalsListProps = {
  professionals?: Professional[];
};

export default function ProfessionalsList({ professionals }: ProfessionalsListProps) {
  return (
    <ul>
      {professionals?.map((professional) => (
        <li key={professional.id}>
          {professional.name} - {professional.profession}
        </li>
      ))}
    </ul>
  );
}
