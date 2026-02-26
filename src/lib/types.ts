export interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  department: string;
  year: number;
  avatar: string;
  role: 'student' | 'admin';
}

export interface Seat {
  id: string;
  tableNumber: number;
  seatNumber: number;
  label: string;
}

export interface Booking {
  id: string;
  studentId: string;
  seatId: string;
  location: 'library' | 'cse-lab';
  timeSlot: string;
  date: string;
  status: 'active' | 'checked-in' | 'completed' | 'no-show' | 'cancelled';
  groupId?: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  size: number;
  creatorId: string;
  memberIds: string[];
  location?: 'library' | 'cse-lab';
  timeSlot?: string;
  date?: string;
  seatIds: string[];
}

export type Location = 'library' | 'cse-lab';

export const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
];

export const LOCATIONS: { value: Location; label: string; icon: string }[] = [
  { value: 'library', label: 'Library', icon: '📚' },
  { value: 'cse-lab', label: 'CSE Lab', icon: '💻' },
];
