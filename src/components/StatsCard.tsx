import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'success' | 'warning' | 'destructive';
}

const colorMap = {
  primary: 'from-primary/20 to-primary/5 border-primary/20',
  success: 'from-success/20 to-success/5 border-success/20',
  warning: 'from-warning/20 to-warning/5 border-warning/20',
  destructive: 'from-destructive/20 to-destructive/5 border-destructive/20',
};

const iconColorMap = {
  primary: 'text-primary bg-primary/15',
  success: 'text-success bg-success/15',
  warning: 'text-warning bg-warning/15',
  destructive: 'text-destructive bg-destructive/15',
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'primary' }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorMap[color]} p-5`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${iconColorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}
