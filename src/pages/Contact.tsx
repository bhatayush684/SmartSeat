import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Clock, Send, MessageSquare, 
  HelpCircle, Bug, Star, Users, Building
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare, color: 'text-blue-500' },
    { value: 'support', label: 'Technical Support', icon: HelpCircle, color: 'text-orange-500' },
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
    { value: 'feature', label: 'Feature Request', icon: Star, color: 'text-green-500' },
    { value: 'partnership', label: 'Partnership', icon: Users, color: 'text-purple-500' }
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'support@smartseat.com',
      description: 'Get help within 24 hours'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9AM-6PM EST'
    },
    {
      icon: MapPin,
      label: 'Office',
      value: '123 Education Street, Tech City, TC 12345',
      description: 'Visit us by appointment'
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: 'Within 24 hours',
      description: 'Faster for premium users'
    }
  ];

  const faqs = [
    {
      question: 'How do I book a seat?',
      answer: 'Simply log in to your account, select your preferred location and time slot, then choose an available seat on the interactive map.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 30 minutes before the scheduled time without any penalty.'
    },
    {
      question: 'What happens if I don\'t show up?',
      answer: 'Repeated no-shows may result in temporary restrictions on your booking privileges. We recommend cancelling if you can\'t make it.'
    },
    {
      question: 'How do study groups work?',
      answer: 'You can create or join study groups, book multiple adjacent seats, and collaborate with your team members.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely! We use industry-standard encryption and security practices to protect your personal information.'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
      toast.success('Message sent successfully! We\'ll get back to you soon.');
    }, 2000);
  };

  return (
    <div className="space-y-16">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
          Get in Touch
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions, feedback, or need support? We're here to help you make the most of SmartSeat Planner.
        </p>
      </motion.section>

      {/* Contact Info Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {contactInfo.map((info, index) => (
          <motion.div
            key={info.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="glass rounded-xl p-6 text-center border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
              <info.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{info.label}</h3>
            <p className="text-primary font-medium mb-1">{info.value}</p>
            <p className="text-sm text-muted-foreground">{info.description}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Contact Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid lg:grid-cols-2 gap-12"
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-6">Send us a Message</h2>
          <p className="text-muted-foreground mb-8">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Inquiry Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {contactTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.type === type.value
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-border bg-secondary/30 hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <type.icon className={`w-4 h-4 ${type.color}`} />
                      <span className="text-sm font-medium text-foreground">{type.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="How can we help you?"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </div>

        <div className="space-y-8">
          {/* Office Hours */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 border border-border/50"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Office Hours
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday</span>
                <span className="text-foreground font-medium">9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday</span>
                <span className="text-foreground font-medium">10:00 AM - 4:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday</span>
                <span className="text-foreground font-medium">Closed</span>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-8 border border-border/50"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group">
                  <summary className="cursor-pointer font-medium text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                    {faq.question}
                    <span className="text-primary transform group-open:rotate-180 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
