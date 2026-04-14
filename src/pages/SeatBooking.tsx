import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import SeatMap from '@/components/SeatMap';
import { Location, LOCATIONS, TIME_SLOTS } from '@/lib/types';
import { MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SeatBookingPage() {
  const { user } = useAuth();
  const { bookings, getBookingsForSlot, getSeatsForLocation, addBooking, getUserBookingsToday } = useBooking();

  const [location, setLocation] = useState<Location>('library');
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[0]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const seats = getSeatsForLocation(location);
  const bookedSeats = getBookingsForSlot(location, timeSlot, today);
  const todayBookings = getUserBookingsToday(user!._id);
  const canBook = todayBookings.length < 2;

  const handleBook = async () => {
    if (!selectedSeat) return;
    const result = await addBooking({
      student: user!._id,
      seatId: selectedSeat,
      location,
      timeSlot,
      date: today,
      status: 'active',
    });
    if (result.success) {
      toast.success('Seat booked successfully!');
      setSelectedSeat(null);
    } else {
      toast.error(result.error || 'Booking failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Book a Seat</h1>
        <p className="text-muted-foreground text-sm mt-1">Select your location, time slot, and seat.</p>
      </div>

      {!canBook && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          You've reached the maximum of 2 bookings per day.
        </motion.div>
      )}

      {/* Location Select */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" /> Select Your Location
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LOCATIONS.map(loc => {
            const isActive = location === loc.value;
            const currentBookings = bookings.filter(b => b.location === loc.value && b.date === today && b.status !== 'cancelled').length;
            const total = loc.value === 'library' ? 32 : 36;
            
            return (
              <motion.button
                key={loc.value}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setLocation(loc.value); setSelectedSeat(null); }}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isActive
                    ? 'border-primary/50 bg-primary/10 shadow-[0_0_20px_hsla(var(--primary),0.1)]'
                    : 'border-border bg-card/40 hover:border-primary/30 hover:bg-card/60'
                }`}
              >
                {isActive && <motion.div layoutId="active-loc" className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-bl-3xl flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-primary" /></motion.div>}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover:scale-110 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                    {loc.icon}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">{loc.label}</p>
                    <div className="flex items-center gap-3 mt-1">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                         {total} Seats Total
                       </span>
                       <span className="text-[10px] text-muted-foreground font-medium">
                         {total - currentBookings} available
                       </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time Slot */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Time Slot
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {TIME_SLOTS.map(slot => (
            <motion.button
              key={slot}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setTimeSlot(slot); setSelectedSeat(null); }}
              className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                timeSlot === slot
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {slot}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Seat Map */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">
            {bookedSeats.length} / {seats.length} seats booked
          </p>
        </div>
        <SeatMap
          seats={seats}
          bookedSeats={bookedSeats}
          currentUserId={user!._id}
          selectedSeatId={selectedSeat}
          onSelectSeat={id => setSelectedSeat(selectedSeat === id ? null : id)}
          location={location}
        />
      </div>

      {/* Book Button */}
      <AnimatePresence>
        {selectedSeat && canBook && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBook}
              className="gradient-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-2 glow-primary shadow-2xl"
            >
              <CheckCircle2 className="w-5 h-5" />
              Book {selectedSeat.split('-').pop()?.replace('T', 'Table ').replace('S', ' Seat ')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
