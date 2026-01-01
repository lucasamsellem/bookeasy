'use client';

import ActionButton from '@/components/ActionButton';
import AppointmentCard from '@/components/AppointmentCard';
import { Appointment } from '@/types/appointment';

const mockAppointments: Appointment[] = [
  {
    id: 1,
    date: '2025-01-12',
    startTime: '14:00',
    clientName: 'John Doe',
    status: 'confirmed',
  },
];

export default function AppointmentsPage() {
  const handleNewAppointment = () => {
    console.log('New Appointment');
  };

  return (
    <section>
      <h2>
        <ActionButton text='New Appointment' icon='+' onClick={handleNewAppointment} />
      </h2>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        {mockAppointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </section>
  );
}
