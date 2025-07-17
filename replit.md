# Digital Game Cards E-commerce Platform

## Overview

This is a full-featured e-commerce platform for selling digital game cards online. The application allows customers to browse and purchase digital cards for popular games like CrossFire, Free Fire, and PUBG. It features a modern React frontend with a Node.js/Express backend, using PostgreSQL with Drizzle ORM for data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### July 17, 2025 - Database and Authentication Fixes
- ✓ Fixed database connection issues and created PostgreSQL database
- ✓ Added express-session middleware for proper session management
- ✓ Created admin user with credentials: admin / admin123
- ✓ Fixed login validation to accept "admin" as username (not requiring email format)
- ✓ Made payment methods animation infinite and smooth (30s cycle, seamless loop)
- ✓ Added sample games: CrossFire, Free Fire, PUBG Mobile with pricing tiers
- ✓ Added customer reviews for realistic content
- ✓ Admin dashboard now fully functional with login/logout

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL)
- **Authentication**: Session-based auth with bcrypt for password hashing
- **API**: RESTful endpoints for games, cards, comments, and admin operations

### Database Schema
- **Users**: Admin authentication with email/password
- **Games**: Game catalog with slug-based routing
- **Game Cards**: Pricing tiers with points, bonuses, and pricing
- **Comments**: Customer reviews with approval workflow

## Key Components

### Frontend Components
1. **Home Page**: Hero section, game selector, pricing display, and customer reviews
2. **Admin Dashboard**: Complete CRUD operations for games, cards, and comment moderation
3. **Game Selector**: Dynamic dropdown for available games
4. **Game Cards Display**: Responsive grid showing pricing tiers with WhatsApp integration
5. **Comments System**: Customer review submission and display
6. **WhatsApp Integration**: Floating button and automated purchase messaging

### Backend Services
1. **Authentication Service**: Admin login/logout with session management
2. **Game Management**: CRUD operations for games and their associated cards
3. **Comment System**: Review submission and approval workflow
4. **Storage Layer**: Database abstraction with typed interfaces

## Data Flow

1. **Customer Journey**:
   - Browse available games via game selector
   - View pricing tiers for selected game
   - Click purchase button → redirect to WhatsApp with pre-filled message
   - Submit optional review after purchase

2. **Admin Workflow**:
   - Login through admin panel
   - Manage games (add/edit/delete)
   - Configure pricing tiers for each game
   - Moderate customer reviews (approve/reject)

3. **Data Persistence**:
   - All data stored in PostgreSQL via Drizzle ORM
   - Real-time updates through TanStack Query cache invalidation
   - Session persistence for admin authentication

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **bcrypt**: Password hashing for admin authentication
- **express**: Web framework for API endpoints

### UI Dependencies
- **@radix-ui/***: Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe CSS class variants
- **wouter**: Lightweight React router

### Development Tools
- **vite**: Fast build tool and dev server
- **typescript**: Type safety across frontend and backend
- **drizzle-kit**: Database migrations and schema management

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle handles schema migrations

### Environment Configuration
- **Development**: Uses Vite dev server with Express API proxy
- **Production**: Serves static files from Express with API routes
- **Database**: Requires `DATABASE_URL` environment variable for Neon connection

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon serverless recommended)
- Support for ES modules
- Environment variable configuration for database connection

### Key Features for Deployment
- Session-based authentication with secure cookie handling
- CORS configuration for cross-origin requests
- Error handling middleware for API endpoints
- Static file serving for production builds
- Database connection pooling for performance