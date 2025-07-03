# Community Forums

A modern, full-stack community forum platform built with Next.js 13+ and the App Router. This application allows users to create discussion forums, participate in conversations, and build communities around shared interests.

## Tech Stack

### Frontend
- **Next.js 15.3** - React framework with App Router
- **React 19** - UI library
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library

### Backend
- **Next.js API Routes** - Backend API endpoints
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database
- **Supabase** - Authentication and database hosting

### Development Tools
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prisma Studio** - Database management UI

## Features

### Authentication
- Email/password authentication
- GitHub OAuth integration
- Protected routes
- Session management

### Forums
- Create new discussion forums
- Add tags to categorize forums
- Edit forum details
- View all forums on the dashboard

### Comments
- Add comments to forums
- Real-time comment updates
- User-specific comment management

### User Features
- User profiles
- Forum ownership
- Comment authorship

## Getting Started

### Prerequisites
- Node.js 16.8 or later
- PostgreSQL database
- Supabase account (for auth)

### Environment Setup
1. Clone the repository:
```bash
git clone [repository-url]
cd community_forums
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="your-postgresql-connection-string"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

4. Initialize the database:
```bash
npm run db:generate  # Generate Prisma client
npm run db:push     # Push schema to database
npm run db:seed     # (Optional) Seed the database with sample data
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Database Management
- `npm run db:studio` - Open Prisma Studio to manage database
- `npm run db:generate` - Generate Prisma client after schema changes
- `npm run db:push` - Push schema changes to database

## Project Structure

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
