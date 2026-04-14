export interface Student {
  _id: string;
  name: string;
  email: string;
  password?: string;
  department?: string;
  year?: number;
  avatar?: string;
  role: 'student' | 'admin';
}

export interface Seat {
  _id: string;
  tableNumber: number;
  seatNumber: number;
  label: string;
}

export interface Booking {
  _id: string; // From backend
  student: string | Student; // Backend returns populated or object ID
  seatId: string;
  location: 'library' | 'lab';
  timeSlot: string;
  date: string;
  status: 'active' | 'checked-in' | 'completed' | 'no-show' | 'cancelled';
  groupId?: string;
  createdAt: string;
}

export interface Group {
  _id: string;
  name: string;
  code: string;
  maxMembers: number;
  creatorId: string | Student;
  memberIds: (string | Student)[];
  isActive?: boolean;
  isPrivate?: boolean;
  tags?: string[];
  studySubject?: string;
  meetingFrequency?: string;
  nextMeeting?: {
    location?: 'library' | 'lab';
    timeSlot?: string;
    date?: string;
  };
  location?: 'library' | 'lab';  // shorthand accessor for nextMeeting.location
  timeSlot?: string;             // shorthand accessor for nextMeeting.timeSlot
  date?: string;                 // shorthand accessor for nextMeeting.date
  seatIds: string[];
  rules?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityLog {
  _id: string;
  user: string | Student;
  action: string;
  resource: string;
  details: {
    seatId?: string;
    location?: string;
    timeSlot?: string;
    date?: string;
    type?: string;
  };
  createdAt: string;
}

export type Location = 'library' | 'lab';

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
  { value: 'lab', label: 'CSE Lab', icon: '💻' },
];
