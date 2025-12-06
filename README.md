# Interview Prep Hub

Full-stack CRUD application for technical interview preparation.

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- MongoDB + Prisma ORM
- NextAuth v5
- Tailwind CSS
- Zod Validation

## Project Structure

```
app/
├── (auth)/              # Public auth pages
├── (dashboard)/         # Protected dashboard
├── actions/             # Server Actions
└── api/                 # API Routes

lib/
├── prisma.ts           # Database client
└── validations.ts      # Zod schemas

prisma/
├── schema.prisma       # DB schema
└── seed.ts             # Seed data
```

## Setup

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Environment Variables

```env
DATABASE_URL="mongodb+srv://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run db:generate  # Generate Prisma Client
npm run db:push      # Sync schema to MongoDB
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed sample data
```

## Demo Credentials

```
Email: demo@example.com
Password: password123
```

## API Endpoints

- `POST /api/auth/signup` - Register
- `GET /api/auth/session` - Get session
- `GET /api/test-db` - Test database

## Collections

- User
- Question
- PracticeSession
- Collection
- Company
