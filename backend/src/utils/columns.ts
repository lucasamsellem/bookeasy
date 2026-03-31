export const USER_COLUMNS = [
  'id',
  'firstName',
  'lastName',
  'email',
  'role',
  'profession',
  'street',
  'streetNumber',
  'city',
  'createdAt',
  'updatedAt',
].join(', ');

export const BOOKING_COLUMNS = [
  'id',
  'customerId',
  'professionalId',
  "DATE_FORMAT(selectedDate, '%Y-%m-%d') as selectedDate", // ✅
  'selectedHour',
  'status',
  'createdAt',
  'description',
].join(', ');
