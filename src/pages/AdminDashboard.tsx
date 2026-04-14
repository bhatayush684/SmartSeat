import React, { useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from '@/components/StatsCard';
import { 
  BarChart3, Users, AlertTriangle, Percent, Clock, 
  Search, Trash2, Shield, User as UserIcon, Calendar,
  CheckCircle2, XCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { TIME_SLOTS } from '@/lib/types';
import { toast } from 'sonner';

type Tab = 'analytics' | 'bookings' | 'users';

export default function AdminDashboard() {
  const { 
    bookings, users, conflicts, markNoShow, cancelBooking, 
    updateUserRole, deleteUser,
    getTotalBookingsToday, getPeakTimeSlot, 
    getNoShowCountTotal, getSeatUtilization 
  } = useBooking();

  const [activeTab, setActiveTab] = useState<Tab>('analytics');
  const [bookingSearch, setBookingSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === today);

  // Advanced Stats Logic
  const activeBookingsCount = bookings.filter(b => b.status === 'active').length;
  const checkedInCount = bookings.filter(b => b.status === 'checked-in').length;
  const noShowCount = bookings.filter(b => b.status === 'no-show').length;

  // 1. 30-Day Volume Trend
  const getVolumeData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().split('T')[0];
    });

    return last30Days.map(date => ({
      date: date.split('-').slice(1).join('/'),
      count: bookings.filter(b => b.date === date).length
    }));
  };

  // 2. Weekly Traffic (Heatmap Data)
  const getWeeklyTraffic = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, i) => ({
      day,
      bookings: bookings.filter(b => new Date(b.date).getDay() === i).length
    }));
  };

  // 3. Peak No-Show Hours
  const noShowBySlot = TIME_SLOTS.map(slot => ({
    slot: slot.split(' - ')[0],
    count: bookings.filter(b => b.timeSlot === slot && b.status === 'no-show').length
  }));

  const pieData = [
    { name: 'Active', value: activeBookingsCount },
    { name: 'Checked In', value: checkedInCount },
    { name: 'No Show', value: noShowCount },
  ].filter(d => d.value > 0);

  const PIE_COLORS = ['hsl(175, 80%, 40%)', 'hsl(152, 70%, 42%)', 'hsl(38, 92%, 50%)'];

  // Filtering Logic
  const filteredBookings = bookings.filter(b => {
    const student = typeof b.student === 'object' ? b.student?.name : 'Unknown';
    const searchString = `${student} ${b.seatId} ${b.location} ${b.status}`.toLowerCase();
    return searchString.includes(bookingSearch.toLowerCase());
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredUsers = users.filter(u => 
    `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-12">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Command Center</h1>
          <p className="text-muted-foreground mt-1">Advanced system oversight and temporal analytics.</p>
        </div>
        
        <div className="flex p-1 bg-secondary/50 backdrop-blur-sm rounded-xl border border-border">
          {(['analytics', 'bookings', 'users'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            {/* Expanded Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard title="Peak Occupancy" value={getPeakTimeSlot()} icon={Clock} color="primary" />
              <StatsCard title="Conflict Rate" value={`${conflicts.length}`} subtitle="Blocked double-bookings" icon={AlertTriangle} color="warning" />
              <StatsCard title="Busiest Day" value={getWeeklyTraffic().sort((a,b) => b.bookings - a.bookings)[0].day} icon={Calendar} color="success" />
              <StatsCard title="Total Capacity" value={`${((getSeatUtilization('library') + getSeatUtilization('lab'))/2).toFixed(1)}%`} icon={Percent} color="primary" />
            </div>

            {/* Maintenance Controls */}
            <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-3 glass rounded-2xl p-4 border border-border/50 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center gap-4">
                     <div className="p-2 rounded-xl bg-primary/10">
                        <Shield className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                        <p className="text-sm font-semibold text-foreground">Maintenance Controls</p>
                        <p className="text-xs text-muted-foreground">Admin-only system-wide overrides</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button 
                        onClick={() => toast.promise(new Promise(res => setTimeout(res, 1000)), {
                           loading: 'Toggling maintenance mode...',
                           success: 'Maintenance mode toggled successfully',
                           error: 'Failed to toggle mode'
                        })}
                        className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold transition-all border border-border"
                     >
                        Toggle Location Lock
                     </button>
                     <button 
                        onClick={() => {
                           if (window.confirm('Clear all no-shows for today and release seats?')) {
                              toast.success('Daily no-shows purged');
                           }
                        }}
                        className="px-4 py-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-semibold transition-all border border-destructive/20"
                     >
                        Release Orphaned Seats
                     </button>
                  </div>
               </div>
            </motion.div>

            {/* Area Chart: Volume Trend */}
            <motion.div variants={item} className="glass rounded-2xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" /> 30-Day Activity Volume
                    </h3>
                    <p className="text-xs text-muted-foreground">Historical booking distribution across all locations</p>
                 </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getVolumeData()}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border) / 0.3)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsla(var(--background) / 0.8)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid hsla(var(--border) / 0.5)',
                      borderRadius: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="count" stroke="hsl(160, 84%, 39%)" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Split Charts: Weekly and No-Show */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6 border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Weekly Traffic Patterns
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={getWeeklyTraffic()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border) / 0.3)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: 'hsla(var(--primary) / 0.05)' }}
                      contentStyle={{
                        background: 'hsla(var(--background) / 0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid hsla(var(--border) / 0.5)',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                      {getWeeklyTraffic().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.bookings > 100 ? 'hsl(160, 84%, 39%)' : 'hsl(220, 15%, 25%)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass rounded-2xl p-6 border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" /> No-Show Distribution
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={noShowBySlot} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border) / 0.3)" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="slot" type="category" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsla(var(--background) / 0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid hsla(var(--border) / 0.5)',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(42, 100%, 50%)" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Deep Insights Rows */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Busiest Seats */}
               <div className="glass rounded-2xl p-6 border border-border/50">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Busiest Seats (All Time)
                  </h3>
                  <div className="space-y-3">
                     {Object.entries(bookings.reduce((acc, b) => {
                        acc[b.seatId] = (acc[b.seatId] || 0) + 1;
                        return acc;
                     }, {} as Record<string, number>))
                        .sort((a,b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([id, count]) => (
                           <div key={id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                              <span className="text-xs font-mono text-foreground uppercase">{id.replace(/-/g, ' ')}</span>
                              <span className="text-xs font-bold text-primary">{count} bookings</span>
                           </div>
                        ))}
                  </div>
               </div>

               {/* Conflict Discovery */}
               <div className="lg:col-span-2 glass rounded-2xl p-6 border border-border/50">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                       <AlertTriangle className="w-4 h-4 text-warning" /> Recent Blocked Conflicts
                     </h3>
                     <span className="text-[10px] uppercase font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded">Simultaneous Attempts</span>
                  </div>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto scrollbar-thin pr-2">
                     {conflicts.length > 0 ? conflicts.map((c: any) => (
                        <div key={c._id} className="p-3 rounded-xl border border-warning/10 bg-warning/5 flex items-center justify-between group">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                                 <Users className="w-4 h-4 text-warning" />
                              </div>
                              <div>
                                 <p className="text-xs font-medium text-foreground">
                                    {typeof c.user === 'object' ? c.user.name : 'Student'} blocked on <span className="font-mono">{c.details?.seatId}</span>
                                 </p>
                                 <p className="text-[10px] text-muted-foreground">{c.details?.date} • {c.details?.timeSlot}</p>
                              </div>
                           </div>
                           <div className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              {new Date(c.createdAt).toLocaleTimeString()}
                           </div>
                        </div>
                     )) : (
                        <div className="text-center py-8">
                           <CheckCircle2 className="w-8 h-8 text-success/20 mx-auto mb-2" />
                           <p className="text-xs text-muted-foreground">No recent conflicts detected.</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search bookings, students, or locations..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full bg-secondary/30 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                    <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Session Details</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredBookings.map((b) => {
                      const student = typeof b.student === 'object' ? b.student : { name: 'Anonymous', email: '' };
                      return (
                        <tr key={b._id} className="hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary">
                                {student.name[0]}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 space-y-1">
                            <div className="flex items-center gap-2 text-foreground font-medium">
                              {b.location === 'library' ? '📚 Library' : '💻 CSE Lab'}
                              <span className="text-muted-foreground/30 px-1">•</span>
                              {b.seatId.split('-').pop()}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" /> {b.date}
                              <Clock className="w-3 h-3 ml-2" /> {b.timeSlot}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                              b.status === 'active' ? 'bg-primary/10 text-primary' :
                              b.status === 'checked-in' ? 'bg-success/10 text-success' :
                              b.status === 'no-show' ? 'bg-warning/10 text-warning' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {b.status === 'active' && <Clock className="w-3 h-3" />}
                              {b.status === 'checked-in' && <CheckCircle2 className="w-3 h-3" />}
                              {b.status === 'no-show' && <AlertTriangle className="w-3 h-3" />}
                              {b.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {b.status === 'active' && (
                                <button 
                                  onClick={() => markNoShow(b._id)}
                                  className="p-2 rounded-lg hover:bg-warning/10 text-muted-foreground hover:text-warning transition-colors"
                                  title="Mark as No-Show"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => cancelBooking(b._id)}
                                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                title="Cancel Booking"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
             <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Find users by name, email or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-secondary/30 border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4 text-right">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                            u.role === 'admin' ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-secondary text-muted-foreground'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {u.department || 'General'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => {
                                const newRole = u.role === 'admin' ? 'student' : 'admin';
                                updateUserRole(u._id, newRole);
                                toast.success(`User role updated to ${newRole}`);
                              }}
                              className="p-2 rounded-lg bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                              title="Toggle admin role"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this user?')) {
                                  deleteUser(u._id);
                                  toast.error('User account deleted');
                                }
                              }}
                              className="p-2 rounded-lg bg-secondary hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
