import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User as UserIcon, Loader2, Calendar, Armchair, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { Location, TIME_SLOTS } from '@/lib/types';
import { toast } from 'sonner';

type Message = {
  id: string;
  role: 'bot' | 'user';
  content: string | React.ReactNode;
  timestamp: Date;
  suggestions?: string[];
};

const SUGGESTIONS = [
  "Book a library seat",
  "Available seats in lab",
  "Show my schedule",
  "Help me with conflicts"
];

export default function Chatbot() {
  const { user } = useAuth();
  const { addBooking, getSeatsForLocation, getBookingsForSlot, getUserBookingsToday } = useBooking();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: 'Hi there! I am the SmartSeat Planner assistant. How can I help you today? Try saying "Find me a seat in the library" or "Book a lab table".',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const command = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    // Simulate network delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 800));

    const today = new Date().toISOString().split('T')[0];
    const todayBookings = getUserBookingsToday(user._id);
    let botResponseContent: string | React.ReactNode;

    // Context Parsing Logic
    if (command.includes('hello') || command.includes('hi')) {
      botResponseContent = `Hello ${user.name}! I'm your SmartSeat assistant. How can I facilitate your productivity today?`;
    } 
    else if (command.includes('my schedule') || command.includes('my booking') || command.includes('show my')) {
      if (todayBookings.length === 0) {
        botResponseContent = "You don't have any active bookings for today yet. Want me to find you a spot?";
      } else {
        botResponseContent = (
          <div className="space-y-2">
            <p className="font-semibold text-primary">Your Schedule For Today:</p>
            <div className="space-y-2">
              {todayBookings.map(b => (
                <div key={b._id} className="p-3 bg-secondary/50 rounded-xl border border-border/50 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold block capitalize">{b.location} Seat {b.seatId.split('-').pop()}</span>
                    <span className="text-muted-foreground">{b.timeSlot}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
    else if (command.includes('book') || command.includes('find') || command.includes('reserve') || command.includes('seat')) {
      if (todayBookings.length >= 2) {
        botResponseContent = "Maximum daily capacity reached! You already have 2 active bookings for today.";
      } else {
        const isLab = command.includes('lab') || command.includes('cse');
        const location: Location = isLab ? 'lab' : 'library'; 
        
        let suggestedSlot = TIME_SLOTS[0];
        let availableSeat = null;
        const allSeats = getSeatsForLocation(location);

        for (const slot of TIME_SLOTS) {
          const booked = getBookingsForSlot(location, slot, today);
          const freeSeats = allSeats.filter(s => !booked.some(b => b.seatId === s.id));
          if (freeSeats.length > 0) {
            suggestedSlot = slot;
            availableSeat = freeSeats[Math.floor(Math.random() * freeSeats.length)].id;
            break;
          }
        }

        if (!availableSeat) {
          botResponseContent = `The ${location} is at full capacity for today. Would you like to check tomorrow?`;
        } else {
          botResponseContent = (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="w-4 h-4" />
                <p className="font-bold">Optimized Spot Found</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-2">
                <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                  <span>Location</span>
                  <span>{location}</span>
                </div>
                <div className="flex justify-between text-[13px] font-bold">
                  <span>Seat</span>
                  <span className="text-primary">{availableSeat.split('-').pop()}</span>
                </div>
                <div className="flex justify-between text-[13px] font-bold">
                  <span>Slot</span>
                  <span>{suggestedSlot}</span>
                </div>
              </div>
              <button 
                onClick={async () => {
                  if (!user) {
                    toast.error('Please login first');
                    return;
                  }
                  toast.loading('Confirming reservation...', { id: 'bot-booking' });
                  const res = await addBooking({
                    student: user._id, seatId: availableSeat, location, timeSlot: suggestedSlot, date: today, status: 'active'
                  });
                  if (res.success) {
                    toast.success('Confirmed! Seat reserved.', { id: 'bot-booking' });
                    setMessages(p => [...p, { id: Date.now().toString(), role: 'bot', content: 'Fantastic! I managed to secure that for you. Anything else?', timestamp: new Date() }]);
                  } else {
                    toast.error(res.error || 'Seat just taken by another student!', { id: 'bot-booking' });
                  }
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Booking
              </button>
            </div>
          );
        }
      }
    } else {
      // Fallback for unrecognized messages
      botResponseContent = {
        type: 'fallback',
        content: "I'm still learning! I didn't quite catch that. Try one of these quick actions:",
        suggestions: SUGGESTIONS
      };
    }

    const botMessage: Message = { 
      id: Date.now().toString(), 
      role: 'bot', 
      content: typeof botResponseContent === 'object' && (botResponseContent as any).type === 'fallback' 
        ? (botResponseContent as any).content 
        : botResponseContent, 
      timestamp: new Date(),
      suggestions: typeof botResponseContent === 'object' && (botResponseContent as any).type === 'fallback' 
        ? (botResponseContent as any).suggestions 
        : undefined
    };
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  if (!user) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] glass-strong rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border-border/50"
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2 text-primary-foreground">
                <Bot className="w-5 h-5" />
                <div>
                  <h3 className="font-bold text-sm">Smart Assistant</h3>
                  <p className="text-[10px] opacity-80 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors p-1 rounded-md hover:bg-primary-foreground/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'bot' ? 'bg-primary/20 text-primary' : 'bg-muted text-foreground'}`}>
                    {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-sm' 
                      : 'bg-secondary text-foreground rounded-bl-sm border border-border/50 shadow-sm'
                  }`}>
                    {msg.content}
                    {msg.suggestions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setInput(s);
                              // We wait for the setInput to take effect before calling handleSend
                              // but since handleSend uses 'input' state, we might need to pass it directly
                              // For simplicity, we'll manually trigger it
                              const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                              setTimeout(() => handleSend(fakeEvent), 0);
                            }}
                            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-wide"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className={`text-[9px] mt-1 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 border border-border/50">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 border-t border-border bg-card/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-secondary border border-border rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-sans"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1 top-1 bottom-1 w-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-primary text-primary-foreground shadow-2xl flex items-center justify-center z-50 glow-primary-sm border border-primary-foreground/20"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare className="w-6 h-6 fill-current opacity-90" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
