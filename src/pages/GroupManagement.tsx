import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { motion } from 'framer-motion';
import { Users, Plus, ArrowRight, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { dummyStudents } from '@/lib/data';

export default function GroupManagement() {
  const { user } = useAuth();
  const { groups, createGroup, joinGroup } = useBooking();
  const [tab, setTab] = useState<'my' | 'create' | 'join'>('my');
  const [groupName, setGroupName] = useState('');
  const [groupSize, setGroupSize] = useState(4);
  const [joinCode, setJoinCode] = useState('');

  const myGroups = groups.filter(g => g.memberIds.includes(user!.id));

  const handleCreate = () => {
    if (!groupName.trim()) { toast.error('Enter a group name'); return; }
    const g = createGroup({ name: groupName, size: groupSize, creatorId: user!.id, memberIds: [user!.id] });
    toast.success(`Group created! Code: ${g.code}`);
    setGroupName('');
    setTab('my');
  };

  const handleJoin = () => {
    if (!joinCode.trim()) { toast.error('Enter a group code'); return; }
    const result = joinGroup(joinCode.toUpperCase(), user!.id);
    if (result.success) {
      toast.success('Joined group successfully!');
      setJoinCode('');
      setTab('my');
    } else {
      toast.error(result.error || 'Failed to join');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Group Booking</h1>
        <p className="text-muted-foreground text-sm mt-1">Create or join study groups for adjacent seating.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-secondary">
        {[
          { key: 'my', label: 'My Groups' },
          { key: 'create', label: 'Create Group' },
          { key: 'join', label: 'Join Group' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'my' && (
        <div className="space-y-4">
          {myGroups.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No groups yet. Create or join one!</p>
            </div>
          ) : (
            myGroups.map(group => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{group.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {group.memberIds.length}/{group.size} members
                    </p>
                  </div>
                  <button
                    onClick={() => copyCode(group.code)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-mono font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {group.code}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.memberIds.map(memberId => {
                    const member = dummyStudents.find(s => s.id === memberId);
                    return (
                      <span key={memberId} className="px-2.5 py-1 rounded-full bg-secondary text-xs text-secondary-foreground font-medium">
                        {member?.name || memberId}
                        {memberId === group.creatorId && ' 👑'}
                      </span>
                    );
                  })}
                </div>
                {group.location && (
                  <p className="text-xs text-muted-foreground mt-3">
                    📍 {group.location === 'library' ? 'Library' : 'CSE Lab'} • {group.timeSlot}
                  </p>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}

      {tab === 'create' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Group Name</label>
            <input
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="e.g. Study Group Alpha"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Group Size</label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map(s => (
                <button
                  key={s}
                  onClick={() => setGroupSize(s)}
                  className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                    groupSize === s ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Group
          </motion.button>
        </motion.div>
      )}

      {tab === 'join' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Group Code</label>
            <input
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter group code"
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-center text-lg tracking-widest"
              maxLength={8}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoin}
            className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" /> Join Group
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
