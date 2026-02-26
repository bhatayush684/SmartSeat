import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Student } from '@/lib/types';
import { dummyStudents } from '@/lib/data';

interface AuthContextType {
  user: Student | null;
  login: (studentId: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Student | null>(() => {
    const stored = localStorage.getItem('smartseat_user');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });

  const login = useCallback((studentId: string, password: string) => {
    const student = dummyStudents.find(s => s.id === studentId && s.password === password);
    if (!student) return { success: false, error: 'Invalid Student ID or password' };
    setUser(student);
    localStorage.setItem('smartseat_user', JSON.stringify(student));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('smartseat_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
