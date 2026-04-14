import React from 'react';
import { motion } from 'framer-motion';
import { Seat, Booking, Location } from '@/lib/types';

interface SeatMapProps {
  seats: Seat[];
  bookedSeats: Booking[];
  currentUserId: string;
  selectedSeatId: string | null;
  onSelectSeat: (seatId: string) => void;
  location: Location;
}

export default function SeatMap({ seats, bookedSeats, currentUserId, selectedSeatId, onSelectSeat }: SeatMapProps) {
  const tables = seats.reduce<Record<number, Seat[]>>((acc, seat) => {
    if (!acc[seat.tableNumber]) acc[seat.tableNumber] = [];
    acc[seat.tableNumber].push(seat);
    return acc;
  }, {});

  const getSeatStatus = (seatId: string) => {
    const booking = bookedSeats.find(b => b.seatId === seatId);
    if (!booking) return selectedSeatId === seatId ? 'selected' : 'available';
    
    // Distinguish based on pseudo-bookings (group-*) or real bookings
    const studentId = typeof booking.student === 'object' ? booking.student._id : booking.student;
    if (studentId === currentUserId) return 'reserved';
    return 'booked';
  };

  const statusStyles: Record<string, string> = {
    available: 'seat-available cursor-pointer hover:scale-110',
    booked: 'seat-booked cursor-not-allowed opacity-60',
    reserved: 'seat-reserved hover:scale-110',
    selected: 'seat-selected cursor-pointer',
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-medium">
        {[
          { label: 'Available', cls: 'seat-available' },
          { label: 'Booked / Group Reserved', cls: 'seat-booked' },
          { label: 'Your Booking', cls: 'seat-reserved' },
          { label: 'Selected', cls: 'seat-selected' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${item.cls}`} />
            <span className="text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.entries(tables).map(([tableNum, tableSeats]) => (
          <motion.div
            key={tableNum}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Number(tableNum) * 0.05 }}
            className="glass rounded-xl p-4"
          >
            <p className="text-xs font-semibold text-muted-foreground mb-3 text-center">
              Table {tableNum}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {tableSeats.map(seat => {
                const status = getSeatStatus(seat._id);
                return (
                  <motion.button
                    key={seat._id}
                    whileHover={status === 'available' || status === 'selected' || status === 'reserved' ? { scale: 1.08 } : {}}
                    whileTap={status === 'available' || status === 'selected' ? { scale: 0.95 } : {}}
                    onClick={() => {
                      if (status === 'available' || status === 'selected' || status === 'reserved') onSelectSeat(seat._id);
                    }}
                    disabled={status === 'booked'}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${statusStyles[status]}`}
                  >
                    {seat.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
