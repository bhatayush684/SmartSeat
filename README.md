# SmartSeat Planner

🪑 **A modern, production-ready seat booking system for educational institutions**

Transform the way students book and manage study spaces with our intelligent seat planning platform. Built with cutting-edge technology and designed for exceptional user experience.

## ✨ Features

### 🎯 Core Functionality
- **Smart Seat Booking** - Interactive seat maps with real-time availability
- **Group Study Management** - Create and join collaborative study groups
- **Time Slot Management** - Flexible scheduling with automated reminders
- **Multi-Location Support** - Library and computer lab seat management
- **Real-time Analytics** - Comprehensive usage tracking and insights

### 👥 User Experience
- **Modern UI/UX** - Beautiful, responsive design with smooth animations
- **Role-based Access** - Student and admin dashboards with tailored features
- **Notification System** - Real-time updates and booking reminders
- **Mobile Responsive** - Works seamlessly on all devices
- **Dark Mode Support** - Comfortable viewing in any lighting

### 🛡️ Enterprise Features
- **Secure Authentication** - JWT-based auth with role management
- **Activity Logging** - Complete audit trail of all user actions
- **Data Privacy** - GDPR-compliant data handling
- **Scalable Architecture** - Built for high-traffic environments

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd smartseat-planner

# Install dependencies
npm install
cd server && npm install && cd ..

# Setup environment
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and JWT secret

# Seed database with sample data
cd server && npm run seed && cd ..

# Start development servers
npm run dev          # Frontend (http://localhost:5173)
cd server && npm run dev  # Backend (http://localhost:5000)
```

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | password123 |
| Student | user@test.com | password123 |
| Student | user2@test.com | password123 |

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for lightning-fast development
- **Tailwind CSS** + shadcn/ui for stunning UI
- **Framer Motion** for smooth animations
- **React Query** for powerful data fetching
- **React Router** for seamless navigation

### Backend Stack
- **Node.js** + Express with TypeScript
- **MongoDB** + Mongoose for flexible data modeling
- **JWT** for secure authentication
- **bcryptjs** for password security
- **Comprehensive middleware** for validation and logging

## 📱 Pages & Features

### 🏠 Public Pages
- **Login** - Secure authentication with demo credentials
- **About** - Platform information and features overview
- **Contact** - Support and help resources

### 👤 Student Dashboard
- **Dashboard** - Personal overview with booking stats
- **Book Seat** - Interactive seat selection interface
- **Groups** - Study group management
- **My Bookings** - Booking history and management
- **Profile** - Personal information and password management
- **Settings** - Preferences and notification controls
- **Notifications** - Real-time updates and alerts

### 🛠️ Admin Dashboard
- **Command Center** - System analytics and oversight
- **User Management** - Complete user administration
- **Booking Management** - Monitor and manage all bookings
- **Analytics** - Charts and usage statistics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Current user info
- `GET /api/auth/` - All users (admin only)

### Bookings
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/checkin` - Check in
- `PATCH /api/bookings/:id/noshow` - Mark no-show

### Groups
- `GET /api/groups` - Get groups
- `POST /api/groups` - Create group
- `PATCH /api/groups/:id/join` - Join group

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark read
- `DELETE /api/notifications/:id` - Delete

### Settings
- `GET /api/user/settings` - Get settings
- `PUT /api/user/settings` - Update settings
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/change-password` - Change password

## 📊 Database Schema

### Core Models
- **Users** - Authentication, roles, and activity tracking
- **Bookings** - Seat reservations with status management
- **Groups** - Study group collaboration
- **Notifications** - User alerts and updates
- **Settings** - User preferences and profiles
- **Activity Logs** - Complete audit trail

## 🎨 Design System

- **Modern Glassmorphism** - Elegant translucent design elements
- **Consistent Color Palette** - Professional color scheme
- **Smooth Animations** - Framer Motion powered interactions
- **Responsive Grid** - Mobile-first design approach
- **Accessibility** - WCAG compliant components

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS protection
- Activity logging and audit trails
- Rate limiting protection

## 📈 Performance

- Optimistic updates for instant feedback
- Component memoization for smooth rendering
- Lazy loading with code splitting
- Efficient database queries with indexes
- Image optimization and caching
- Service worker for offline support

## 🛠️ Development

### Available Scripts

```bash
# Frontend
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview build
npm run lint       # Code linting

# Backend (from server/ directory)
npm run dev        # Development server
npm run build      # TypeScript compilation
npm run start      # Production server
npm run seed       # Database seeding
```

### Project Structure
```
smartseat-planner/
├── src/                    # Frontend source
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities
│   └── pages/             # Page components
├── server/                 # Backend source
│   └── src/
│       ├── controllers/   # API handlers
│       ├── models/        # Database models
│       ├── routes/        # API routes
│       └── middleware/    # Express middleware
└── public/                 # Static assets
```

## 🚀 Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://your-atlas-connection
JWT_SECRET=your-secure-jwt-secret
```

### Production Build
```bash
# Build frontend
npm run build

# Build backend
cd server && npm run build

# Start production server
cd server && npm start
```

## 🧪 Testing

The project includes comprehensive testing setup:
- Unit tests with Vitest
- Component testing with React Testing Library
- API endpoint testing
- E2E testing setup ready

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@smartseat.com
- 📖 Documentation: Check `SETUP.md` for detailed guide
- 🐛 Issues: Create an issue in the repository
- 💬 Discord: Join our community server

---

**Built with ❤️ by the SmartSeat Team**

*Transforming education, one seat at a time.*
