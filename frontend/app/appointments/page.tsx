'use client';

import { useQuery } from '@tanstack/react-query';
import ActionButton from '@/components/ActionButton';
import AppointmentCard from '@/components/AppointmentCard';
import { Appointment } from '@/types/appointment';
import { apiFetch } from '@/services/api';
import ProfessionalsList from '@/components/ProfessionalsList';

export interface Professional {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'professional';
  profession: string;
  street: string | null;
  streetNumber: string | null;
  city: string | null;
  createdAt: string;
  updatedAt: string;
}

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
  const { data: professionals, refetch: refetchProfessionals } = useQuery<Professional[]>({
    queryKey: ['professionals'],
    enabled: false, // ← empêche l’exécution automatique
    queryFn: () => apiFetch('/customers/professionals'),
  });

  const handleNewAppointment = async () => {
    try {
      await refetchProfessionals();
    } catch (err) {
      console.error(err);
    }
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

      <ProfessionalsList professionals={professionals} />
    </section>
  );
}
