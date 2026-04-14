import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Armchair, Users, BookOpen, BarChart3, Menu, X, User, Settings, Bell, ChevronDown, HelpCircle, Home } from 'lucide-react';
import { useState } from 'react';
import Chatbot from '@/components/Chatbot';

import api from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/book-seat', label: 'Book Seat', icon: Armchair },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/my-bookings', label: 'My Bookings', icon: BookOpen },
];

const publicLinks = [
  { to: '/about', label: 'About', icon: HelpCircle },
  { to: '/contact', label: 'Contact', icon: HelpCircle },
];

const adminLinks = [
  { to: '/admin', label: 'Admin Dashboard', icon: BarChart3 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications-nav'],
    queryFn: async () => {
      const { data } = await api.get('/notifications');
      return data;
    },
    enabled: !!user,
    refetchInterval: 30000 // Refetch every 30s
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-nav'] });
    }
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;
  const topNotifications = notifications.slice(0, 5);

  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center transition-transform group-hover:scale-110">
                <Armchair className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold gradient-text">SmartSeat</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Notifications, User Menu + Logout */}
            <div className="hidden md:flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className={`relative p-2 rounded-lg transition-colors ${
                    notificationOpen ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 mt-3 w-80 glass rounded-2xl border border-border/50 shadow-2xl overflow-hidden z-[60]"
                  >
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <p className="font-semibold text-sm">Notifications</p>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                          {unreadCount} NEW
                        </span>
                      )}
                    </div>
                    
                    <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
                      {topNotifications.length > 0 ? (
                        topNotifications.map((n: any) => (
                          <div 
                            key={n._id} 
                            onClick={() => {
                              if (!n.read) markReadMutation.mutate(n._id);
                            }}
                            className={`p-4 border-b border-border/10 hover:bg-primary/5 transition-colors cursor-pointer group ${!n.read ? 'bg-primary/5' : ''}`}
                          >
                            <p className={`text-xs font-semibold mb-1 ${!n.read ? 'text-primary' : 'text-foreground'}`}>
                              {n.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground line-clamp-2">{n.message}</p>
                            <p className="text-[9px] text-muted-foreground/50 mt-2">
                              {new Date(n.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground font-medium">No system alerts yet</p>
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      to="/notifications" 
                      onClick={() => setNotificationOpen(false)}
                      className="block p-3 text-center text-[11px] font-bold text-primary hover:bg-primary/10 transition-colors border-t border-border/30"
                    >
                      VIEW ALL NOTIFICATIONS
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-accent transition-all border border-transparent hover:border-border/50"
                >
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-[11px] font-bold leading-tight">{user?.name}</p>
                    <p className="text-[9px] text-muted-foreground leading-tight uppercase tracking-wider">{user?.role}</p>
                  </div>
                  <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute right-0 mt-3 w-56 glass rounded-2xl border border-border/50 shadow-2xl overflow-hidden z-[60]"
                  >
                    <div className="p-4 bg-primary/5 border-b border-border/30">
                      <p className="text-xs font-bold text-foreground">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                      >
                        <User className="w-4 h-4" />
                        Account Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all w-full mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Secure Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass-strong border-t border-border px-4 py-3 space-y-1"
          >
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  location.pathname === link.to ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            {publicLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  location.pathname === link.to ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                location.pathname === '/profile' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                location.pathname === '/settings' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <Link
              to="/notifications"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                location.pathname === '/notifications' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>
        )}
      </nav>

      {/* Content */}
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>
      <Chatbot />
    </div>
  );
}
