import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking, Group, Location, Student } from '@/lib/types';
import { librarySeats, labSeats } from '@/lib/data';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

interface BookingContextType {
  bookings: Booking[];
  groups: Group[];
  addBooking: (booking: Omit<Booking, '_id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  cancelBooking: (bookingId: string) => Promise<void>;
  checkIn: (bookingId: string) => Promise<void>;
  getBookingsForSlot: (location: Location, timeSlot: string, date: string) => Booking[];
  getUserBookingsToday: (studentId: string) => Booking[];
  getUserBookings: (studentId: string) => Booking[];
  getNoShowCount: (studentId: string) => number;
  markNoShow: (bookingId: string) => Promise<void>;
  createGroup: (group: Omit<Group, '_id' | 'code' | 'seatIds'>) => Promise<{ success: boolean; group?: Group; error?: string }>;
  joinGroup: (code: string) => Promise<{ success: boolean; error?: string; group?: Group }>;
  getSeatsForLocation: (location: Location) => typeof librarySeats;
  getTotalBookingsToday: () => number;
  getPeakTimeSlot: () => string;
  getNoShowCountTotal: () => number;
  getSeatUtilization: (location: Location) => number;
  users: Student[];
  conflicts: ActivityLog[];
  updateUserRole: (userId: string, role: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const today = new Date().toISOString().split('T')[0];

  const { data: allBookings = [] } = useQuery({
    queryKey: ['bookings', 'all'],
    queryFn: async () => {
      // If admin, fetch all bookings. If student, fetch their bookings plus active map bookings
      if (user?.role === 'admin') {
        const { data } = await api.get('/bookings/admin/all');
        return data as Booking[];
      } else if (user) {
        // Fetch user's bookings
        const userRes = await api.get('/bookings/my');
        // Fetch active map bookings for today to populate seat map
        const mapRes = await api.get(`/bookings/map?date=${today}`);
        
        // Merge without duplicates (using _id)
        const mapBookings = mapRes.data;
        const myBookings = userRes.data;
        
        const merged = [...myBookings];
        mapBookings.forEach((mb: Booking) => {
          if (!merged.find((b: Booking) => b._id === mb._id)) {
            merged.push(mb);
          }
        });
        return merged as Booking[];
      }
      return [];
    },
    enabled: !!user,
    refetchInterval: 5000, // Poll every 5s for real-time seat availability
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const { data } = await api.get('/groups/admin/all');
        return data as Group[];
      } else if (user) {
        const { data } = await api.get('/groups/my');
        return data as Group[];
      }
      return [];
    },
    enabled: !!user
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const { data } = await api.get('/auth');
        return data;
      }
      return [];
    },
    enabled: !!user && user.role === 'admin'
  });

  const { data: conflicts = [] } = useQuery({
    queryKey: ['conflicts'],
    queryFn: async () => {
      if (user?.role === 'admin') {
        const { data } = await api.get('/bookings/admin/conflicts');
        return data;
      }
      return [];
    },
    enabled: !!user && user.role === 'admin'
  });

  const getSeatsForLocation = (location: Location) =>
    location === 'library' ? librarySeats : labSeats;

  const getBookingsForSlot = (location: Location, timeSlot: string, date: string) => {
    const activeBookings = allBookings.filter(b => b.location === location && b.timeSlot === timeSlot && b.date === date && b.status === 'active');
    
    // Also consider seats reserved by groups for this slot
    const groupBookings = groups.filter(g => g.location === location && g.timeSlot === timeSlot && g.date === date);
    
    // Convert group-reserved seats into "pseudo-bookings" for the map logic if not already in activeBookings
    const groupPseudoBookings = groupBookings.flatMap(g => 
      g.seatIds.map(sid => ({
        _id: `group-${g._id}-${sid}`,
        seatId: sid,
        status: 'active' as const,
        student: g.creatorId, // Show as creator's booking
        location: g.location as Location,
        timeSlot: g.timeSlot!,
        date: g.date!,
        createdAt: new Date().toISOString()
      }))
    );

    // Merge group seats that aren't already covered by a real booking
    const merged = [...activeBookings];
    groupPseudoBookings.forEach((gb) => {
        if (!merged.find(b => b.seatId === gb.seatId)) {
            merged.push(gb);
        }
    });

    return merged as Booking[];
  };

  const getUserBookingsToday = (studentId: string) =>
    allBookings.filter(b => typeof b.student === 'object' ? b.student._id === studentId : b.student === studentId).filter(b => b.date === today && b.status === 'active');

  const getUserBookings = (studentId: string) =>
    allBookings.filter(b => typeof b.student === 'object' ? b.student._id === studentId : b.student === studentId);

  const getNoShowCount = (studentId: string) => 0; // Deprecated with simple backend

  const addBooking = async (booking: Omit<Booking, '_id' | 'createdAt'>) => {
    try {
      await api.post('/bookings', booking);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Booking failed'
        : 'Booking failed';
      return { success: false, error: errorMessage };
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      await api.delete(`/bookings/${bookingId}`);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    } catch (err) {
      console.error('Cancel booking error:', err);
    }
  };

  const checkIn = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/checkin`);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    } catch (err) {
      console.error('Check-in error:', err);
    }
  };

  const markNoShow = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/noshow`);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    } catch (err) {
      console.error('Mark no-show error:', err);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await api.patch(`/auth/${userId}/role`, { role });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      console.error('Update user role error:', err);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.delete(`/auth/${userId}`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  const createGroup = async (group: Omit<Group, '_id' | 'code' | 'seatIds'>) => {
    try {
      const { data } = await api.post('/groups', group);
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      return { success: true, group: data };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create group'
        : 'Failed to create group';
      return { success: false, error: errorMessage };
    }
  };

  const joinGroup = async (code: string) => {
    try {
      const { data } = await api.post('/groups/join', { code });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      return { success: true, group: data };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to join group'
        : 'Failed to join group';
      return { success: false, error: errorMessage };
    }
  };

  const getTotalBookingsToday = () => allBookings.filter(b => b.date === today && b.status === 'active').length;
  
  const getPeakTimeSlot = () => {
    const counts: Record<string, number> = {};
    allBookings.filter(b => b.date === today && b.status === 'active')
      .forEach(b => { counts[b.timeSlot] = (counts[b.timeSlot] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  };

  const getNoShowCountTotal = () => 0;

  const getSeatUtilization = (location: Location) => {
    const seats = getSeatsForLocation(location);
    const booked = allBookings.filter(b => b.location === location && b.date === today && b.status === 'active');
    const totalSlots = seats.length * 6; // 6 time slots
    return totalSlots > 0 ? Math.round((booked.length / totalSlots) * 100) : 0;
  };

  return (
    <BookingContext.Provider value={{
      bookings: allBookings, groups, addBooking, cancelBooking, checkIn,
      getBookingsForSlot, getUserBookingsToday, getUserBookings,
      getNoShowCount, markNoShow, createGroup, joinGroup, getSeatsForLocation,
      getTotalBookingsToday, getPeakTimeSlot, getNoShowCountTotal, getSeatUtilization,
      users, conflicts, updateUserRole, deleteUser
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
