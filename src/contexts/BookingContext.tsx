import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Booking, Group, Location } from '@/lib/types';
import { initialBookings, initialGroups, librarySeats, labSeats } from '@/lib/data';

interface BookingContextType {
  bookings: Booking[];
  groups: Group[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  cancelBooking: (bookingId: string) => void;
  checkIn: (bookingId: string) => void;
  getBookingsForSlot: (location: Location, timeSlot: string, date: string) => Booking[];
  getUserBookingsToday: (studentId: string) => Booking[];
  getUserBookings: (studentId: string) => Booking[];
  getNoShowCount: (studentId: string) => number;
  createGroup: (group: Omit<Group, 'id' | 'code' | 'seatIds'>) => Group;
  joinGroup: (code: string, studentId: string) => { success: boolean; error?: string; group?: Group };
  getSeatsForLocation: (location: Location) => typeof librarySeats;
  getTotalBookingsToday: () => number;
  getPeakTimeSlot: () => string;
  getNoShowCountTotal: () => number;
  getSeatUtilization: (location: Location) => number;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  const today = new Date().toISOString().split('T')[0];

  const getSeatsForLocation = (location: Location) =>
    location === 'library' ? librarySeats : labSeats;

  const getBookingsForSlot = useCallback((location: Location, timeSlot: string, date: string) =>
    bookings.filter(b => b.location === location && b.timeSlot === timeSlot && b.date === date && b.status !== 'cancelled'),
    [bookings]);

  const getUserBookingsToday = useCallback((studentId: string) =>
    bookings.filter(b => b.studentId === studentId && b.date === today && b.status !== 'cancelled'),
    [bookings, today]);

  const getUserBookings = useCallback((studentId: string) =>
    bookings.filter(b => b.studentId === studentId),
    [bookings]);

  const getNoShowCount = useCallback((studentId: string) =>
    bookings.filter(b => b.studentId === studentId && b.status === 'no-show').length,
    [bookings]);

  const addBooking = useCallback((booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const userToday = bookings.filter(b => b.studentId === booking.studentId && b.date === today && b.status !== 'cancelled');
    if (userToday.length >= 2) return { success: false, error: 'Maximum 2 bookings per day reached' };

    const existing = bookings.find(b =>
      b.seatId === booking.seatId && b.timeSlot === booking.timeSlot &&
      b.date === booking.date && b.status !== 'cancelled'
    );
    if (existing) return { success: false, error: 'Seat already booked for this slot' };

    const newBooking: Booking = {
      ...booking,
      id: `B${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings(prev => [...prev, newBooking]);
    return { success: true };
  }, [bookings, today]);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
  }, []);

  const checkIn = useCallback((bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'checked-in' as const } : b));
  }, []);

  const createGroup = useCallback((group: Omit<Group, 'id' | 'code' | 'seatIds'>) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newGroup: Group = { ...group, id: `G${Date.now()}`, code, seatIds: [] };
    setGroups(prev => [...prev, newGroup]);
    return newGroup;
  }, []);

  const joinGroup = useCallback((code: string, studentId: string) => {
    const group = groups.find(g => g.code === code);
    if (!group) return { success: false, error: 'Group not found' };
    if (group.memberIds.includes(studentId)) return { success: false, error: 'Already in this group' };
    if (group.memberIds.length >= group.size) return { success: false, error: 'Group is full' };

    const updated = { ...group, memberIds: [...group.memberIds, studentId] };
    setGroups(prev => prev.map(g => g.id === group.id ? updated : g));
    return { success: true, group: updated };
  }, [groups]);

  const getTotalBookingsToday = useCallback(() =>
    bookings.filter(b => b.date === today && b.status !== 'cancelled').length,
    [bookings, today]);

  const getPeakTimeSlot = useCallback(() => {
    const counts: Record<string, number> = {};
    bookings.filter(b => b.date === today && b.status !== 'cancelled')
      .forEach(b => { counts[b.timeSlot] = (counts[b.timeSlot] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, [bookings, today]);

  const getNoShowCountTotal = useCallback(() =>
    bookings.filter(b => b.status === 'no-show').length,
    [bookings]);

  const getSeatUtilization = useCallback((location: Location) => {
    const seats = getSeatsForLocation(location);
    const booked = bookings.filter(b => b.location === location && b.date === today && b.status !== 'cancelled');
    const totalSlots = seats.length * 6; // 6 time slots
    return totalSlots > 0 ? Math.round((booked.length / totalSlots) * 100) : 0;
  }, [bookings, today]);

  return (
    <BookingContext.Provider value={{
      bookings, groups, addBooking, cancelBooking, checkIn,
      getBookingsForSlot, getUserBookingsToday, getUserBookings,
      getNoShowCount, createGroup, joinGroup, getSeatsForLocation,
      getTotalBookingsToday, getPeakTimeSlot, getNoShowCountTotal, getSeatUtilization,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
