import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, MapPin, QrCode } from 'lucide-react';
import { toast } from 'sonner';

export default function MyBookings() {
  const { user } = useAuth();
  const { getUserBookings, cancelBooking, checkIn } = useBooking();
  const bookings = getUserBookings(user!._id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const statusConfig: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
    active: { label: 'Active', cls: 'bg-primary/15 text-primary', icon: Clock },
    'checked-in': { label: 'Checked In', cls: 'bg-success/15 text-success', icon: CheckCircle2 },
    completed: { label: 'Completed', cls: 'bg-muted text-muted-foreground', icon: CheckCircle2 },
    'no-show': { label: 'No Show', cls: 'bg-destructive/15 text-destructive', icon: XCircle },
    cancelled: { label: 'Cancelled', cls: 'bg-muted text-muted-foreground', icon: XCircle },
  };

  const handleCheckIn = (id: string) => {
    checkIn(id);
    toast.success('Checked in successfully! ✓');
  };

  const handleCancel = (id: string) => {
    cancelBooking(id);
    toast.success('Booking cancelled');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage all your seat bookings.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No bookings yet. Go book a seat!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking, i) => {
            const config = statusConfig[booking.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${config.cls}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground">{booking.date}</span>
                    </div>
                    <p className="font-semibold text-foreground">
                      {booking.location === 'library' ? '📚 Library' : '💻 CSE Lab'} — {booking.seatId.split('-').pop()?.replace('T', 'Table ').replace('S', ' Seat ')}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" /> {booking.timeSlot}
                    </p>
                  </div>

                  {booking.status === 'active' && (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCheckIn(booking._id)}
                        className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5"
                      >
                        <QrCode className="w-4 h-4" /> Check In
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancel(booking._id)}
                        className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-colors"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
