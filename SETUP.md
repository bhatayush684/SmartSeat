# SmartSeat Planner - Complete Setup Guide

## Overview

SmartSeat Planner is a modern, production-ready seat booking system for educational institutions. This guide will help you set up and run the complete system.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for data fetching
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd smartseat-planner

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

Create environment files:

**Backend (server/.env):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartseat
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. Database Setup

Make sure MongoDB is running, then seed the database:

```bash
cd server
npm run seed
```

This will create:
- 5 test users with different roles
- Sample bookings and groups
- Notifications and settings
- Activity logs

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd ..
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | password123 |
| Student | user@test.com | password123 |
| Student | user2@test.com | password123 |
| Student | james@test.com | password123 |
| Student | sophia@test.com | password123 |

## Features Overview

### User Features
- **Dashboard**: Personal overview with booking stats and quick actions
- **Seat Booking**: Interactive seat maps for library and lab locations
- **Group Management**: Create and join study groups
- **My Bookings**: View and manage personal booking history
- **Profile**: Edit personal information and change password
- **Settings**: Customize preferences and notifications
- **Notifications**: Real-time updates and alerts

### Admin Features
- **Admin Dashboard**: System analytics and user management
- **User Management**: View, edit, and delete user accounts
- **Booking Oversight**: Monitor all bookings and mark no-shows
- **Analytics**: Charts and statistics for system usage

### Public Pages
- **About**: Information about the platform
- **Contact**: Support and contact information
- **Login**: Authentication with demo credentials

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/` - Get all users (admin only)

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/:id/checkin` - Check in to booking
- `PATCH /api/bookings/:id/noshow` - Mark as no-show
- `DELETE /api/bookings/:id` - Cancel booking

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create new group
- `PATCH /api/groups/:id/join` - Join group
- `DELETE /api/groups/:id` - Leave group

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### User Settings
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update settings
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/change-password` - Change password

## Database Schema

### Users
- Basic info, role, login stats
- Department and year
- Activity tracking

### Bookings
- Student, seat, location, time
- Status tracking (active, checked-in, no-show, etc.)
- Check-in/out timestamps

### Groups
- Study group management
- Member lists and meeting schedules
- Tags and descriptions

### Notifications
- User notifications
- Multiple types (booking, system, reminder)
- Read status tracking

### Settings
- User preferences
- Profile information
- Academic details

### Activity Logs
- User action tracking
- IP and user agent logging

## Development

### Project Structure
```
smartseat-planner/
src/
  components/     # Reusable UI components
  contexts/       # React contexts (Auth, Booking)
  hooks/          # Custom hooks
  lib/            # Utilities and API client
  pages/          # Page components
server/
  src/
    controllers/  # API route handlers
    models/        # Database models
    routes/        # API routes
    middleware/    # Express middleware
    config/        # Database configuration
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm run start` - Start production server
- `npm run seed` - Seed database with sample data

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://your-atlas-connection
JWT_SECRET=your-secure-jwt-secret
```

### Build Commands
```bash
# Build frontend
npm run build

# Build backend
cd server && npm run build

# Start production server
cd server && npm start
```

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation and sanitization
- CORS protection
- Activity logging

## Performance Optimizations

- Lazy loading with React Query
- Optimistic updates
- Component memoization
- Efficient database queries with indexes
- Responsive design for all screen sizes

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **Port Already in Use**
   - Change PORT in .env or kill process on port

3. **CORS Issues**
   - Ensure frontend URL is allowed in backend CORS config

4. **Authentication Issues**
   - Check JWT_SECRET is set
   - Clear browser localStorage

### Debug Mode

Enable debug logging:
```env
DEBUG=smartseat:*
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@smartseat.com
- GitHub Issues: Create an issue in the repository
- Documentation: Check the inline code comments

---

**SmartSeat Planner** - Transforming the way students manage their study spaces.
