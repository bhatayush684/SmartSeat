import React from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { motion } from 'framer-motion';
import StatsCard from '@/components/StatsCard';
import { BarChart3, Users, AlertTriangle, Percent, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TIME_SLOTS } from '@/lib/types';
import { dummyStudents } from '@/lib/data';

export default function AdminDashboard() {
  const { bookings, getTotalBookingsToday, getPeakTimeSlot, getNoShowCountTotal, getSeatUtilization } = useBooking();
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelled');

  // Chart data: bookings per time slot
  const slotData = TIME_SLOTS.map(slot => ({
    slot: slot.split(' - ')[0],
    bookings: todayBookings.filter(b => b.timeSlot === slot).length,
  }));

  // Pie data: status breakdown
  const statusCounts = todayBookings.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ['hsl(175, 80%, 40%)', 'hsl(152, 70%, 42%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)'];

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time seat booking analytics.</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Bookings Today" value={getTotalBookingsToday()} icon={BarChart3} color="primary" />
        <StatsCard title="Peak Time Slot" value={getPeakTimeSlot()} icon={Clock} color="success" />
        <StatsCard title="No-Shows" value={getNoShowCountTotal()} icon={AlertTriangle} color="warning" />
        <StatsCard title="Library Utilization" value={`${getSeatUtilization('library')}%`} icon={Percent} color="primary" />
      </motion.div>

      {/* Charts */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Bookings by Time Slot</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={slotData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
              <XAxis dataKey="slot" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(220, 20%, 10%)',
                  border: '1px solid hsl(220, 15%, 16%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 20%, 95%)',
                }}
              />
              <Bar dataKey="bookings" fill="hsl(175, 80%, 40%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Status Breakdown</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220, 20%, 10%)',
                    border: '1px solid hsl(220, 15%, 16%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 20%, 95%)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-12">No data yet</p>
          )}
        </div>
      </motion.div>

      {/* Bookings Table */}
      <motion.div variants={item} className="glass rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">All Bookings Today</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-5 text-muted-foreground font-medium">Student</th>
                <th className="text-left py-3 px-5 text-muted-foreground font-medium">Location</th>
                <th className="text-left py-3 px-5 text-muted-foreground font-medium">Seat</th>
                <th className="text-left py-3 px-5 text-muted-foreground font-medium">Time</th>
                <th className="text-left py-3 px-5 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {todayBookings.map(b => {
                const student = dummyStudents.find(s => s.id === b.studentId);
                const statusCls: Record<string, string> = {
                  active: 'bg-primary/15 text-primary',
                  'checked-in': 'bg-success/15 text-success',
                  'no-show': 'bg-destructive/15 text-destructive',
                };
                return (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-5 text-foreground">{student?.name || b.studentId}</td>
                    <td className="py-3 px-5 text-muted-foreground">{b.location === 'library' ? '📚 Library' : '💻 CSE Lab'}</td>
                    <td className="py-3 px-5 font-mono text-foreground">{b.seatId.split('-').pop()}</td>
                    <td className="py-3 px-5 text-muted-foreground">{b.timeSlot}</td>
                    <td className="py-3 px-5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusCls[b.status] || 'bg-muted text-muted-foreground'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
