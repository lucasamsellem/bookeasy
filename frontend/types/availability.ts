export type Availability = {
  id?: number;
  professionalId: number;
  date: string; // YYYY-MM-DD
  startHour: string; // HH:mm
  endHour: string; // HH:mm
  createdAt?: string;
  updatedAt?: string;
};
