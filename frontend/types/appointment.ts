export type Appointment = {
  id: number;
  date: string;
  startTime: string;
  clientName: string;
  status: 'confirmed' | 'cancelled';
};
