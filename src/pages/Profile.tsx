import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, BookOpen, Calendar, Save, Camera, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    year: user?.year || '',
    phone: '',
    bio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.put('/user/profile', {
        name: formData.name,
        department: formData.department,
        year: formData.year
      });
      
      // Update user context
      await login(formData.email, passwordData.currentPassword || 'dummy'); // This will refresh user data
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update profile';
        toast.error(errorMessage);
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await api.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to change password'
        : 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: 'Total Bookings', value: user?.totalBookings || 0, icon: BookOpen },
    { label: 'No-Shows', value: user?.noShowCount || 0, icon: X },
    { label: 'Login Count', value: user?.loginCount || 0, icon: Calendar },
    { label: 'Member Since', value: new Date(user?.createdAt || '').toLocaleDateString(), icon: User }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(!isEditing)}
          className={`p-3 rounded-xl transition-all ${
            isEditing 
              ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' 
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          }`}
        >
          {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </motion.button>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-8 border border-border/50"
      >
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20">
                <User className="w-16 h-16 text-primary" />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
              >
                <Camera className="w-4 h-4" />
              </motion.button>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">{user?.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <p className="text-foreground">{user?.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <p className="text-foreground">{user?.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Department
                </label>
                {isEditing ? (
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="EEE">EEE</option>
                    <option value="General">General</option>
                  </select>
                ) : (
                  <p className="text-foreground">{user?.department || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Year
                </label>
                {isEditing ? (
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select Year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                ) : (
                  <p className="text-foreground">{user?.year || 'Not specified'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-xl bg-secondary text-secondary-foreground font-medium"
                >
                  Cancel
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="glass rounded-xl p-6 border border-border/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <stat.icon className="w-8 h-8 text-primary/20" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Password Change Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-8 border border-border/50"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6">Change Password</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePasswordUpdate}
            disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword}
            className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50"
          >
            Update Password
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
