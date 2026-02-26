import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { motion } from 'framer-motion';
import StatsCard from '@/components/StatsCard';
import { Armchair, Users, BookOpen, Clock, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { getUserBookingsToday, getNoShowCount, bookings } = useBooking();

  const todayBookings = getUserBookingsToday(user!.id);
  const noShows = getNoShowCount(user!.id);
  const activeBooking = todayBookings.find(b => b.status === 'active' || b.status === 'checked-in');

  const today = new Date().toISOString().split('T')[0];
  const allTodayActive = bookings.filter(b => b.date === today && b.status !== 'cancelled');
  const totalSeats = 32 + 36; // library + lab
  const availableSeats = totalSeats - new Set(allTodayActive.map(b => b.seatId)).size;

  const quickActions = [
    { to: '/book-seat', label: 'Book a Seat', desc: 'Reserve your spot', icon: Armchair, color: 'from-primary/20 to-primary/5' },
    { to: '/groups', label: 'Join Group', desc: 'Study together', icon: Users, color: 'from-success/20 to-success/5' },
    { to: '/my-bookings', label: 'My Bookings', desc: 'View & manage', icon: BookOpen, color: 'from-warning/20 to-warning/5' },
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Welcome */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's your booking overview for today.</p>
      </motion.div>

      {/* Warning banner */}
      {noShows > 0 && (
        <motion.div
          variants={item}
          className="flex items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20"
        >
          <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
          <div>
            <p className="text-sm font-medium text-warning">No-Show Warning</p>
            <p className="text-xs text-muted-foreground">You have {noShows} no-show(s). Please check in on time to avoid restrictions.</p>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Today's Bookings" value={todayBookings.length} subtitle="Max 2 per day" icon={BookOpen} color="primary" />
        <StatsCard title="Available Seats" value={availableSeats} subtitle="Across all locations" icon={Armchair} color="success" />
        <StatsCard title="No-Shows" value={noShows} subtitle="All time" icon={AlertTriangle} color={noShows > 0 ? 'warning' : 'primary'} />
        <StatsCard title="Status" value={activeBooking ? 'Active' : 'No Booking'} subtitle={activeBooking?.timeSlot || 'Book a seat now'} icon={activeBooking ? CheckCircle2 : Clock} color={activeBooking ? 'success' : 'primary'} />
      </motion.div>

      {/* Active booking */}
      {activeBooking && (
        <motion.div variants={item} className="glass rounded-xl p-5 glow-primary-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Active Booking</p>
              <p className="text-lg font-semibold text-foreground">{activeBooking.seatId.replace(/-/g, ' ').replace(/T/, ' Table ').replace(/S/, ' Seat ')}</p>
              <p className="text-sm text-muted-foreground">{activeBooking.location === 'library' ? '📚 Library' : '💻 CSE Lab'} • {activeBooking.timeSlot}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${activeBooking.status === 'checked-in' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
              {activeBooking.status === 'checked-in' ? '✓ Checked In' : 'Pending Check-in'}
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map(action => (
            <Link key={action.to} to={action.to}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-5 rounded-xl bg-gradient-to-br ${action.color} border border-border hover:border-primary/30 transition-colors group`}
              >
                <action.icon className="w-8 h-8 text-foreground mb-3" />
                <p className="font-semibold text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
                <ArrowRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
