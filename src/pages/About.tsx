import React from 'react';
import { motion } from 'framer-motion';
import { 
  Armchair, Users, Shield, Zap, Clock, Award, 
  BookOpen, Target, Lightbulb, CheckCircle2, 
  ArrowRight, Github, Twitter, Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const features = [
    {
      icon: Armchair,
      title: 'Smart Seat Booking',
      description: 'Reserve seats in libraries and labs with real-time availability'
    },
    {
      icon: Users,
      title: 'Group Study',
      description: 'Create and join study groups for collaborative learning'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant booking confirmations and real-time updates'
    },
    {
      icon: Clock,
      title: 'Time Management',
      description: 'Flexible time slots with automated reminders'
    },
    {
      icon: Award,
      title: 'Analytics Dashboard',
      description: 'Track usage patterns and optimize resource allocation'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '50,000+', label: 'Bookings Made' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  const team = [
    {
      name: 'SmartSeat Team',
      role: 'Development & Design',
      description: 'Dedicated team of developers and designers creating innovative educational technology solutions.'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary to-orange-500 mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)]"
        >
          <Armchair className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
          About SmartSeat Planner
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Revolutionizing the way students book and manage study spaces. 
          Our intelligent seat planning system ensures fair access to resources 
          while promoting collaborative learning environments.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <Link to="/book-seat">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
            >
              View Demo
            </motion.button>
          </Link>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="glass rounded-2xl p-6 text-center border border-border/50"
          >
            <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
            <p className="text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-12 border border-border/50"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              Our Mission
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              We believe that access to quality study spaces should be seamless and fair. 
              SmartSeat Planner was created to solve the common challenges students face 
              when trying to find and reserve seats in libraries and computer labs.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Our platform uses intelligent algorithms to optimize seat allocation, 
              reduce conflicts, and provide real-time insights to help educational 
              institutions better manage their resources.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-foreground">Fair resource distribution</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-foreground">Real-time availability tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-foreground">Collaborative study tools</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-orange-500/20 rounded-3xl blur-3xl" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative glass rounded-3xl p-8 border border-border/50"
            >
              <Lightbulb className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground text-center mb-3">
                Innovation in Education
              </h3>
              <p className="text-muted-foreground text-center">
                Leveraging technology to create better learning environments for students worldwide.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Key Features</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need for efficient seat management and booking
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="glass rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-colors group"
            >
              <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Technology Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass rounded-3xl p-12 border border-border/50"
      >
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Built with Modern Technology</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            'React', 'TypeScript', 'Node.js', 'MongoDB',
            'Tailwind CSS', 'Framer Motion', 'Express', 'JWT Auth'
          ].map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              className="glass rounded-xl p-4 text-center border border-border/50 hover:border-primary/30 transition-colors"
            >
              <p className="font-medium text-foreground">{tech}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Meet the Team</h2>
          <p className="text-muted-foreground text-lg">
            The passionate people behind SmartSeat Planner
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mx-auto mb-4 flex items-center justify-center border-2 border-primary/20">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{member.name}</h3>
              <p className="text-primary font-medium mb-3">{member.role}</p>
              <p className="text-muted-foreground">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="glass rounded-3xl p-12 text-center border border-border/50 bg-gradient-to-br from-primary/5 to-orange-500/5"
      >
        <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Ready to Transform Your Study Experience?
        </h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of students who are already using SmartSeat Planner 
          to optimize their study sessions and collaborate more effectively.
        </p>
        
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-orange-500 text-white font-semibold flex items-center gap-2 mx-auto shadow-[0_0_20px_rgba(249,115,22,0.4)]"
          >
            Get Started Today <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
      </motion.section>
    </div>
  );
}
