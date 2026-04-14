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

  const todayBookings = getUserBookingsToday(user!._id);
  const noShows = getNoShowCount(user!._id);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const libraryActive = allTodayActive.filter(b => b.location === 'library').length;
  const labActive = allTodayActive.filter(b => b.location === 'lab').length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-12">
      {/* Welcome */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here's your booking overview for today.</p>
        </div>
        <div className="flex gap-2">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-primary/20 bg-primary/5">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
             <div className="text-xs">
                <p className="font-semibold text-foreground">Library</p>
                <p className="text-muted-foreground">{32 - libraryActive} seats free</p>
             </div>
          </div>
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-success/20 bg-success/5">
             <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
             <div className="text-xs">
                <p className="font-semibold text-foreground">CSE Lab</p>
                <p className="text-muted-foreground">{36 - labActive} seats free</p>
             </div>
          </div>
        </div>
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
                className={`p-5 rounded-xl bg-gradient-to-br ${action.color} border border-border hover:border-primary/30 transition-colors group relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-foreground/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
                <action.icon className="w-8 h-8 text-foreground mb-3 relative z-10" />
                <p className="font-semibold text-foreground relative z-10">{action.label}</p>
                <p className="text-xs text-muted-foreground mt-1 relative z-10">{action.desc}</p>
                <ArrowRight className="w-4 h-4 text-muted-foreground mt-3 group-hover:text-primary group-hover:translate-x-1 transition-all relative z-10" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Live Activity Feed */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <div className="glass rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/20">
               {bookings.slice(0, 5).map((act, i) => (
                  <div key={act._id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                           {act.location === 'library' ? <BookOpen className="w-5 h-5 text-primary" /> : <Armchair className="w-5 h-5 text-success" />}
                        </div>
                        <div>
                           <p className="text-sm font-medium text-foreground">Seat {act.seatId.split('-').pop()} reserved</p>
                           <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{act.location} • {act.timeSlot}</p>
                        </div>
                     </div>
                     <div className="text-[10px] text-muted-foreground font-mono">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">System Health</h2>
            <div className="glass rounded-2xl p-6 border border-border/40 space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                     <span className="text-muted-foreground">Server Latency</span>
                     <span className="text-success font-medium">24ms</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-success"></motion.div>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                     <span className="text-muted-foreground">Database Sync</span>
                     <span className="text-primary font-medium">Real-time</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} className="h-full bg-primary"></motion.div>
                  </div>
               </div>
               <div className="pt-2">
                  <p className="text-[10px] text-muted-foreground text-center">
                     Global status: <span className="text-success font-bold">Operational</span>
                  </p>
               </div>
            </div>
         </div>
      </motion.div>
    </motion.div>
  );
}
