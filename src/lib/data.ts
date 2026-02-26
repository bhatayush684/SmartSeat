import { Student, Seat, Booking, Group } from './types';

const today = new Date().toISOString().split('T')[0];

export const dummyStudents: Student[] = [
  { id: 'STU001', name: 'Alex Chen', email: 'alex@university.edu', password: 'pass123', department: 'CSE', year: 3, avatar: 'AC', role: 'student' },
  { id: 'STU002', name: 'Maya Patel', email: 'maya@university.edu', password: 'pass123', department: 'CSE', year: 2, avatar: 'MP', role: 'student' },
  { id: 'STU003', name: 'James Wilson', email: 'james@university.edu', password: 'pass123', department: 'ECE', year: 4, avatar: 'JW', role: 'student' },
  { id: 'STU004', name: 'Sara Kim', email: 'sara@university.edu', password: 'pass123', department: 'CSE', year: 1, avatar: 'SK', role: 'student' },
  { id: 'STU005', name: 'Ravi Kumar', email: 'ravi@university.edu', password: 'pass123', department: 'IT', year: 3, avatar: 'RK', role: 'student' },
  { id: 'STU006', name: 'Emily Brown', email: 'emily@university.edu', password: 'pass123', department: 'CSE', year: 2, avatar: 'EB', role: 'student' },
  { id: 'STU007', name: 'David Lee', email: 'david@university.edu', password: 'pass123', department: 'MECH', year: 3, avatar: 'DL', role: 'student' },
  { id: 'STU008', name: 'Priya Singh', email: 'priya@university.edu', password: 'pass123', department: 'CSE', year: 4, avatar: 'PS', role: 'student' },
  { id: 'STU009', name: 'Tom Martinez', email: 'tom@university.edu', password: 'pass123', department: 'ECE', year: 1, avatar: 'TM', role: 'student' },
  { id: 'STU010', name: 'Lisa Wang', email: 'lisa@university.edu', password: 'pass123', department: 'CSE', year: 2, avatar: 'LW', role: 'student' },
  { id: 'STU011', name: 'Chris Taylor', email: 'chris@university.edu', password: 'pass123', department: 'IT', year: 3, avatar: 'CT', role: 'student' },
  { id: 'STU012', name: 'Nina Gupta', email: 'nina@university.edu', password: 'pass123', department: 'CSE', year: 4, avatar: 'NG', role: 'student' },
  { id: 'ADMIN', name: 'Dr. Admin', email: 'admin@university.edu', password: 'admin123', department: 'Admin', year: 0, avatar: 'AD', role: 'admin' },
];

function generateSeats(location: string): Seat[] {
  const seats: Seat[] = [];
  const tables = location === 'library' ? 8 : 6;
  const seatsPerTable = location === 'library' ? 4 : 6;
  for (let t = 1; t <= tables; t++) {
    for (let s = 1; s <= seatsPerTable; s++) {
      seats.push({
        id: `${location}-T${t}S${s}`,
        tableNumber: t,
        seatNumber: s,
        label: `T${t}-S${s}`,
      });
    }
  }
  return seats;
}

export const librarySeats = generateSeats('library');
export const labSeats = generateSeats('cse-lab');

export const initialBookings: Booking[] = [
  { id: 'B001', studentId: 'STU002', seatId: 'library-T1S2', location: 'library', timeSlot: '10:00 - 12:00', date: today, status: 'checked-in', createdAt: new Date().toISOString() },
  { id: 'B002', studentId: 'STU003', seatId: 'library-T1S3', location: 'library', timeSlot: '10:00 - 12:00', date: today, status: 'active', createdAt: new Date().toISOString() },
  { id: 'B003', studentId: 'STU005', seatId: 'cse-lab-T2S1', location: 'cse-lab', timeSlot: '14:00 - 16:00', date: today, status: 'active', createdAt: new Date().toISOString() },
  { id: 'B004', studentId: 'STU006', seatId: 'library-T3S1', location: 'library', timeSlot: '08:00 - 10:00', date: today, status: 'no-show', createdAt: new Date().toISOString() },
  { id: 'B005', studentId: 'STU008', seatId: 'cse-lab-T1S4', location: 'cse-lab', timeSlot: '16:00 - 18:00', date: today, status: 'active', createdAt: new Date().toISOString() },
  { id: 'B006', studentId: 'STU010', seatId: 'library-T5S2', location: 'library', timeSlot: '12:00 - 14:00', date: today, status: 'checked-in', createdAt: new Date().toISOString() },
  { id: 'B007', studentId: 'STU004', seatId: 'cse-lab-T3S3', location: 'cse-lab', timeSlot: '10:00 - 12:00', date: today, status: 'active', createdAt: new Date().toISOString() },
];

export const initialGroups: Group[] = [
  { id: 'G001', name: 'Study Group Alpha', code: 'ALPHA23', size: 4, creatorId: 'STU002', memberIds: ['STU002', 'STU003'], location: 'library', timeSlot: '10:00 - 12:00', date: today, seatIds: ['library-T1S1', 'library-T1S2', 'library-T1S3', 'library-T1S4'] },
];
