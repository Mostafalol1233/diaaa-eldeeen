# Digital Game Cards E-commerce Platform

A modern e-commerce platform for selling digital game cards with a comprehensive admin dashboard.

## Features

- 🎮 Game cards for CrossFire, Free Fire, and PUBG Mobile
- 💳 WhatsApp integration for payments
- 🔐 Admin dashboard with full CRUD operations
- 📱 Responsive design with dark gaming theme
- ⭐ Customer review system
- 🛡️ Session-based authentication

## Admin Access

- **Username**: admin
- **Password**: admin123

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query
- **Authentication**: Session-based with bcrypt

## Development

```bash
npm install
npm run dev
```

## Database Setup

```bash
npm run db:push
```

## Deployment

### Vercel
1. Connect your repository to Vercel
2. Set environment variables: `DATABASE_URL`
3. Deploy using the included `vercel.json` configuration

### Netlify
1. Connect your repository to Netlify
2. Set environment variables: `DATABASE_URL`
3. Deploy using the included `netlify.toml` configuration

## Environment Variables

Required for production:
- `DATABASE_URL` - PostgreSQL connection string

## Project Structure

```
├── client/           # React frontend
├── server/           # Express backend
├── shared/           # Shared types and schemas
├── vercel.json       # Vercel deployment config
└── netlify.toml      # Netlify deployment config
```

## Admin Dashboard Features

- ✅ Add/Edit/Delete games
- ✅ Add/Edit/Delete game cards
- ✅ Manage pricing and bonuses
- ✅ Comment moderation
- ✅ Active/Inactive status management