'use client';

import { getLoggedUser } from '@/utils/utils';

// const mockAppointments: Appointment[] = [
//   {
//     id: 1,
//     date: '2025-01-12',
//     startTime: '14:00',
//     clientName: 'John Doe',
//     status: 'confirmed',
//   },
// ];

export default function AppointmentsPage() {
  const loggedUser = getLoggedUser();

  return (
    <h2>
      Appointments booked by {loggedUser?.firstName} {loggedUser?.lastName}
    </h2>
  );
}
