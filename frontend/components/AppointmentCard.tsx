import { Appointment } from '@/types/appointment';

type Props = {
  appointment: Appointment;
};

export default function AppointmentCard({ appointment }: Props) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: 4 }}>
      <strong>{appointment.date}</strong>
      <p>{appointment.startTime}</p>
      <p>Client: {appointment.clientName}</p>
      <p>Status: {appointment.status}</p>
    </div>
  );
}
