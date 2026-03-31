export type Booking = {
  id: number;
  date: string;
  startTime: string;
  clientName: string;
  status: 'confirmed' | 'cancelled';
};
