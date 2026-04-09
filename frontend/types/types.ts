export type BookingStatus = 'pending' | 'confirmed' | 'canceled';

export type Role = 'professional' | 'customer' | 'superAdmin';

export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  profession?: string;
  createdAt: string;
  updatedAt: string;
  street?: string;
  streetNumber?: string;
  city?: string;
}

export interface Booking {
  id: number;
  customerId: number;
  professionalId: number;
  selectedDate: string;
  selectedHour: string; // HH:MM:SS
  status: BookingStatus;
  description?: string;
  createdAt: string; // ISO
}

export type Availability = {
  id?: number;
  professionalId: number;
  date: string; // YYYY-MM-DD
  startHour: string; // HH:mm
  endHour: string; // HH:mm
  createdAt?: string;
  updatedAt?: string;
};
