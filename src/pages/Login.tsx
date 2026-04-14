import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Armchair, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard'); // Let App router redirect to /admin if admin later, or we can check here
      window.location.reload(); // Quick way to let root logic route to admin
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-orange-500 mx-auto mb-4 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)]"
          >
            <Armchair className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">SmartSeat</h1>
          <p className="text-muted-foreground mt-2 text-sm">Library & Lab Seat Booking System</p>
        </div>

        {/* Login Form */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Sign in to your account</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@test.com"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-secondary transition-all"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-secondary transition-all"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-border"></span>
              OR QUICK LOGIN
              <span className="w-8 h-[1px] bg-border"></span>
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Admin', email: 'admin@test.com', initial: 'A', role: 'admin' },
                { name: 'User 1', email: 'user@test.com', initial: 'U1', role: 'student' },
                { name: 'User 2', email: 'user2@test.com', initial: 'U2', role: 'student' }
              ].map(profile => (
                <motion.button
                  key={profile.email}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    setError('');
                    setLoading(true);
                    const result = await login(profile.email, 'password123');
                    setLoading(false);
                    if (result.success) {
                      navigate('/dashboard');
                      window.location.reload();
                    } else {
                      setError(result.error || 'Quick login failed');
                    }
                  }}
                  type="button"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-secondary/30 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm mb-2 ${
                    profile.role === 'admin' 
                      ? 'bg-gradient-to-br from-primary to-orange-500 text-white' 
                      : 'bg-accent text-muted-foreground group-hover:text-primary'
                  }`}>
                    {profile.initial}
                  </div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{profile.name}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
