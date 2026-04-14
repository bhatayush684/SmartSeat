import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Moon, Sun, Globe, Volume2, Shield, HelpCircle, 
  Smartphone, Mail, Check, X, Palette, Zap, BookOpen, User
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface UserSettings {
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    bookingReminders: boolean;
    darkMode: boolean;
    language: string;
    timezone: string;
  };
  profile: {
    bio: string;
    phone: string;
    emergencyContact: string;
    dietaryRestrictions: string[];
  };
  academic: {
    studentId: string;
    program: string;
    graduationYear: number;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      bookingReminders: true,
      darkMode: false,
      language: 'en',
      timezone: 'UTC'
    },
    profile: {
      bio: '',
      phone: '',
      emergencyContact: '',
      dietaryRestrictions: []
    },
    academic: {
      studentId: '',
      program: '',
      graduationYear: new Date().getFullYear() + 4
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/user/settings');
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      await api.put('/user/settings', settings);
      setHasChanges(false);
      toast.success('Settings saved successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to save settings'
        : 'Failed to save settings';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const notificationSettings = [
    { 
      key: 'emailNotifications', 
      label: 'Email Notifications', 
      description: 'Receive booking confirmations and updates via email',
      icon: Mail 
    },
    { 
      key: 'pushNotifications', 
      label: 'Push Notifications', 
      description: 'Get instant notifications in your browser',
      icon: Bell 
    },
    { 
      key: 'bookingReminders', 
      label: 'Booking Reminders', 
      description: 'Remind me 15 minutes before my booking starts',
      icon: Smartphone 
    }
  ];

  const appearanceSettings = [
    { 
      key: 'darkMode', 
      label: 'Dark Mode', 
      description: 'Use dark theme across the application',
      icon: Moon 
    }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' }
  ];

  const timezones = [
    'UTC',
    'EST',
    'PST',
    'GMT',
    'CET',
    'IST',
    'JST'
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
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Customize your experience</p>
        </div>
        {hasChanges && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveSettings}
            disabled={isLoading}
            className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </motion.button>
        )}
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-8 border border-border/50"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
        </h2>
        <div className="space-y-4">
          {notificationSettings.map((setting, index) => (
            <motion.div
              key={setting.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <setting.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{setting.label}</p>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateSettings({
                  preferences: {
                    ...settings.preferences,
                    [setting.key]: !settings.preferences[setting.key as keyof typeof settings.preferences]
                  }
                })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.preferences[setting.key as keyof typeof settings.preferences]
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              >
                <motion.div
                  animate={{
                    x: settings.preferences[setting.key as keyof typeof settings.preferences] ? 24 : 0
                  }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Appearance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-8 border border-border/50"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Appearance
        </h2>
        <div className="space-y-6">
          {appearanceSettings.map((setting, index) => (
            <motion.div
              key={setting.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  {settings.preferences.darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{setting.label}</p>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateSettings({
                  preferences: {
                    ...settings.preferences,
                    [setting.key]: !settings.preferences[setting.key as keyof typeof settings.preferences]
                  }
                })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.preferences[setting.key as keyof typeof settings.preferences]
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              >
                <motion.div
                  animate={{
                    x: settings.preferences[setting.key as keyof typeof settings.preferences] ? 24 : 0
                  }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </motion.button>
            </motion.div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Globe className="w-4 h-4" /> Language
              </label>
              <select
                value={settings.preferences.language}
                onChange={(e) => updateSettings({
                  preferences: { ...settings.preferences, language: e.target.value }
                })}
                className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Zap className="w-4 h-4" /> Timezone
              </label>
              <select
                value={settings.preferences.timezone}
                onChange={(e) => updateSettings({
                  preferences: { ...settings.preferences, timezone: e.target.value }
                })}
                className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {timezones.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Academic Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-8 border border-border/50"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Academic Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Student ID</label>
            <input
              type="text"
              value={settings.academic.studentId}
              onChange={(e) => updateSettings({
                academic: { ...settings.academic, studentId: e.target.value }
              })}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter your student ID"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Program</label>
            <input
              type="text"
              value={settings.academic.program}
              onChange={(e) => updateSettings({
                academic: { ...settings.academic, program: e.target.value }
              })}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g., Computer Science"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Graduation Year</label>
            <input
              type="number"
              value={settings.academic.graduationYear}
              onChange={(e) => updateSettings({
                academic: { ...settings.academic, graduationYear: parseInt(e.target.value) }
              })}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 10}
            />
          </div>
        </div>
      </motion.div>

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-8 border border-border/50"
      >
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Additional Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Bio</label>
            <textarea
              value={settings.profile.bio}
              onChange={(e) => updateSettings({
                profile: { ...settings.profile, bio: e.target.value }
              })}
              className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Phone Number</label>
              <input
                type="tel"
                value={settings.profile.phone}
                onChange={(e) => updateSettings({
                  profile: { ...settings.profile, phone: e.target.value }
                })}
                className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Emergency Contact</label>
              <input
                type="text"
                value={settings.profile.emergencyContact}
                onChange={(e) => updateSettings({
                  profile: { ...settings.profile, emergencyContact: e.target.value }
                })}
                className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Emergency contact name and number"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
