import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { Booking } from './models/Booking';
import { Group } from './models/Group';
import { Notification } from './models/Notification';
import { UserSettings } from './models/UserSettings';
import { ActivityLog } from './models/ActivityLog';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartseat');
    
    // Clear all collections
    await User.deleteMany();
    await Booking.deleteMany();
    await Group.deleteMany();
    await Notification.deleteMany();
    await UserSettings.deleteMany();
    await ActivityLog.deleteMany();
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    
    // Create users
    const users = await User.create([
      {
        name: 'Sarah Johnson',
        email: 'admin@test.com',
        password: hash,
        role: 'admin',
        department: 'CSE',
        year: '4th',
        isActive: true,
        loginCount: 45,
        totalBookings: 120,
        noShowCount: 2
      },
      {
        name: 'Michael Chen',
        email: 'user@test.com',
        password: hash,
        role: 'student',
        department: 'CSE',
        year: '3rd',
        isActive: true,
        loginCount: 89,
        totalBookings: 67,
        noShowCount: 1
      },
      {
        name: 'Emily Rodriguez',
        email: 'user2@test.com',
        password: hash,
        role: 'student',
        department: 'ECE',
        year: '2nd',
        isActive: true,
        loginCount: 156,
        totalBookings: 234,
        noShowCount: 0
      },
      {
        name: 'James Wilson',
        email: 'james@test.com',
        password: hash,
        role: 'student',
        department: 'MECH',
        year: '3rd',
        isActive: true,
        loginCount: 67,
        totalBookings: 89,
        noShowCount: 3
      },
      {
        name: 'Sophia Martinez',
        email: 'sophia@test.com',
        password: hash,
        role: 'student',
        department: 'CIVIL',
        year: '1st',
        isActive: true,
        loginCount: 23,
        totalBookings: 12,
        noShowCount: 0
      }
    ]);

    // Create user settings
    for (const user of users) {
      await UserSettings.create({
        user: user._id,
        preferences: {
          emailNotifications: Math.random() > 0.3,
          pushNotifications: Math.random() > 0.2,
          bookingReminders: Math.random() > 0.1,
          darkMode: Math.random() > 0.7,
          language: 'en',
          timezone: 'EST'
        },
        profile: {
          bio: `Passionate ${user.department} student interested in technology and innovation.`,
          phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          emergencyContact: 'Parent: +1 (555) 000-0000'
        },
        academic: {
          studentId: `STU${Math.floor(Math.random() * 90000) + 10000}`,
          program: `${user.department} Engineering`,
          graduationYear: 2025 + parseInt(user.year?.replace(/\D/g, '') || '3')
        }
      });
    }

    // Create groups
    const groups = await Group.create([
      {
        name: 'AI Study Group',
        code: 'AI2024',
        description: 'Focused on artificial intelligence and machine learning concepts',
        maxMembers: 6,
        creatorId: users[1]._id,
        memberIds: [users[1]._id, users[2]._id, users[3]._id],
        isActive: true,
        isPrivate: false,
        tags: ['AI', 'ML', 'Python'],
        studySubject: 'Artificial Intelligence',
        meetingFrequency: 'weekly',
        nextMeeting: {
          location: 'library',
          timeSlot: '2:00 PM - 4:00 PM',
          date: new Date().toISOString().split('T')[0]
        },
        rules: ['Be on time', 'Respect others', 'No food allowed']
      },
      {
        name: 'Web Dev Team',
        code: 'WEB2024',
        description: 'Collaborative web development projects and learning',
        maxMembers: 4,
        creatorId: users[2]._id,
        memberIds: [users[2]._id, users[4]._id],
        isActive: true,
        isPrivate: false,
        tags: ['React', 'Node.js', 'Frontend'],
        studySubject: 'Web Development',
        meetingFrequency: 'bi-weekly',
        nextMeeting: {
          location: 'lab',
          timeSlot: '10:00 AM - 12:00 PM',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0]
        }
      }
    ]);

    // Create bookings across 30 days
    const timeSlots = [
      '08:00 - 10:00',
      '10:00 - 12:00',
      '12:00 - 14:00',
      '14:00 - 16:00',
      '16:00 - 18:00',
      '18:00 - 20:00'
    ];

    const usedSlots = new Set<string>();
    const now = new Date();

    console.log('Generating 30 days of data...');

    for (let dayOffset = -28; dayOffset <= 2; dayOffset++) {
      const dateDate = new Date();
      dateDate.setDate(now.getDate() + dayOffset);
      const dateStr = dateDate.toISOString().split('T')[0];
      const dayOfWeek = dateDate.getDay(); // 0 is Sunday, 2 is Tue, 3 is Wed

      // Higher volume on Tue (2) and Wed (3)
      const volumeScale = (dayOfWeek === 2 || dayOfWeek === 3) ? 2.5 : 1.0;
      const bookingsCount = Math.floor((Math.random() * 15 + 10) * volumeScale);

      for (let i = 0; i < bookingsCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        const randomLocation = Math.random() > 0.5 ? 'library' : 'lab';
        
        const tableId = Math.floor(Math.random() * 8) + 1;
        const seatIdNum = Math.floor(Math.random() * 4) + 1;
        const seatId = `${randomLocation === 'library' ? 'LIB' : 'LAB'}-T${tableId}-S${seatIdNum}`;

        const slotKey = `${randomLocation}-${randomTime}-${dateStr}-${seatId}`;
        
        // Randomly simulate a conflict twice for every 15 successful bookings
        if (i % 15 === 0) {
          await ActivityLog.create({
            user: randomUser._id,
            action: 'conflict',
            resource: 'booking',
            details: { seatId, location: randomLocation, timeSlot: randomTime, date: dateStr, type: 'simultaneous_attempt' },
            ipAddress: '127.0.0.1'
          });
        }

        if (usedSlots.has(slotKey)) continue;
        usedSlots.add(slotKey);

        const isPast = dayOffset < 0;
        let status = 'active';
        if (isPast) {
          const rand = Math.random();
          if (rand < 0.6) status = 'completed';
          else if (rand < 0.8) status = 'no-show';
          else status = 'cancelled';
        }

        await Booking.create({
          student: randomUser._id,
          seatId,
          location: randomLocation,
          timeSlot: randomTime,
          date: dateStr,
          status,
          checkInTime: (status === 'completed' || status === 'checked-in') ? new Date(dateDate.setHours(10,0,0)) : null,
          checkOutTime: status === 'completed' ? new Date(dateDate.setHours(12,0,0)) : null,
          notes: status === 'no-show' ? 'Simulated no-show for analytics' : null
        });
      }
    }

    // Create notifications
    const notificationTypes = ['booking', 'system', 'reminder', 'warning', 'success'];
    const notificationTitles = [
      'Booking Confirmed',
      'System Maintenance',
      'Upcoming Booking Reminder',
      'No-Show Warning',
      'Welcome to SmartSeat!',
      'Group Invitation',
      'Booking Cancelled',
      'Profile Updated'
    ];

    for (const user of users) {
      for (let i = 0; i < Math.floor(Math.random() * 8) + 2; i++) {
        await Notification.create({
          user: user._id,
          title: notificationTitles[Math.floor(Math.random() * notificationTitles.length)],
          message: `This is a sample notification for ${user.name} regarding their account activity.`,
          type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
          read: Math.random() > 0.4
        });
      }
    }

    // Create activity logs (other actions)
    const actions = ['login', 'register', 'cancel', 'update', 'delete'];
    
    for (const user of users) {
      for (let i = 0; i < 15; i++) {
        await ActivityLog.create({
          user: user._id,
          action: actions[Math.floor(Math.random() * actions.length)],
          resource: 'system',
          resourceId: null,
          details: { timestamp: new Date() },
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Sample Browser)'
        });
      }
    }

    console.log('Database seeded successfully!');
    console.log(`\nCreated:`);
    console.log(`- ${users.length} users`);
    console.log(`- ${groups.length} groups`);
    console.log(`- ${await Booking.countDocuments()} bookings`);
    console.log(`- ${await Notification.countDocuments()} notifications`);
    console.log(`- ${await ActivityLog.countDocuments({ action: 'conflict' })} conflicts logged`);
    console.log(`- ${await ActivityLog.countDocuments()} total activity logs`);


    console.log('Database seeded successfully!');
    console.log(`\nCreated:`);
    console.log(`- ${users.length} users`);
    console.log(`- ${groups.length} groups`);
    console.log(`- ${await Booking.countDocuments()} bookings`);
    console.log(`- ${await Notification.countDocuments()} notifications`);
    console.log(`- ${await UserSettings.countDocuments()} user settings`);
    console.log(`- ${await ActivityLog.countDocuments()} activity logs`);
    console.log(`\nTest Credentials:`);
    console.log(`Admin: admin@test.com / password123`);
    console.log(`User: user@test.com / password123`);
    console.log(`User2: user2@test.com / password123`);
    console.log(`James: james@test.com / password123`);
    console.log(`Sophia: sophia@test.com / password123`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
