# Interview Prep Hub

A full-stack technical interview preparation platform built with modern web technologies, enabling users to create, organize, and practice interview questions efficiently with secure authentication and responsive design.

## Problem Statement

Technical interview preparation is challenging for job seekers who need to:
- **Track and organize** diverse interview questions from various companies and topics
- **Store knowledge** in a structured way for future reference
- **Practice systematically** with organized question collections
- **Maintain security** of personal preparation data through authentication

**Target Users:** Job seekers, students, and professionals preparing for technical interviews at FAANG and other tech companies.

## Features

### Core Functionality (CRUD Operations)
- ✅ **Question Management**
  - Create, read, update, delete interview questions
  - Track question metadata (difficulty, category, tags, company)
  - Persistent storage with MongoDB Atlas
  
- ✅ **Collections/Organizing**
  - Group questions by topic, company, or custom categories
  - Add/remove questions from collections
  - Edit and delete collections
  - View collection details with paginated question lists

- ✅ **Authentication & Authorization**
  - Secure user signup and login with bcrypt password hashing
  - JWT-based session management with NextAuth.js v5
  - Protected dashboard requiring authentication
  - Secure logout with session termination

### UI/UX Features
- 📱 **Fully Responsive Design**
  - Mobile-first approach with Tailwind CSS
  - Touch-friendly interface on all devices
  - Adaptive layouts for mobile, tablet, and desktop
  
- ♿ **Accessibility**
  - Semantic HTML structure
  - Proper form labels and field associations
  - ARIA attributes for screen readers
  - Color contrast compliance
  - Keyboard navigation support

- 🎨 **Modern UI**
  - Clean, professional dark theme
  - Intuitive navigation
  - Real-time form validation with user feedback
  - Loading states and error messages

### Dashboard & Analytics
- User statistics (total questions, collections, practice sessions)
- Quick action buttons for common tasks
- Getting started guide for new users

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS with responsive design
- **UI Components:** Custom React components with proper composition
- **State Management:** React hooks (useState, useEffect)
- **Routing:** Next.js App Router

### Backend
- **Runtime:** Node.js with Next.js
- **Server Actions:** Secure server-side operations with type safety
- **API Routes:** RESTful endpoints for auth and operations
- **Authentication:** NextAuth.js v5 with Credentials provider
- **Password Hashing:** bcryptjs (10 salt rounds)

### Database & ORM
- **Database:** MongoDB Atlas (cloud-hosted)
- **ORM:** Prisma 5.22.0 with MongoDB adapter
- **Schema:** Users, Questions, Collections, Practice Sessions

### Quality & Testing
- **Type Safety:** TypeScript with strict configuration
- **Testing Framework:** Vitest
- **E2E Testing:** Playwright
- **Linting:** ESLint
- **Input Validation:** Zod schemas for runtime type checking
- **Rate Limiting:** Custom in-memory rate limiter

### Deployment & DevOps
- **Hosting:** Vercel (serverless deployment)
- **CI/CD:** GitHub Actions (auto-deploy on push)
- **Environment Management:** .env configuration for different stages
- **Monitoring:** Vercel Analytics and error tracking

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Interview Prep Hub                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend Layer (React 19 + Next.js 16)                      │
│  ├─ Authentication Pages (Login/Signup)                      │
│  ├─ Dashboard (User Stats & Quick Actions)                   │
│  ├─ Question Management (CRUD Interface)                     │
│  └─ Collections Management (Group & Organize)                │
│                                                               │
│  Server Layer (Next.js Server Actions & API Routes)          │
│  ├─ Auth Actions (signup, login, logout)                     │
│  ├─ Question Actions (create, read, update, delete)          │
│  ├─ Collection Actions (CRUD + question management)          │
│  ├─ Session Management (practice tracking)                   │
│  └─ Middleware (authentication & rate limiting)              │
│                                                               │
│  Data Layer (MongoDB + Prisma)                               │
│  ├─ Users Collection (auth data)                             │
│  ├─ Questions Collection (user questions)                    │
│  ├─ Collections (question groupings)                         │
│  └─ Practice Sessions (activity tracking)                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
1. User interacts with React component
2. Component submits data via Server Action
3. Server validates input with Zod schemas
4. Prisma executes database operation
5. Response returned to client for UI update
6. Middleware ensures authentication on protected routes

## Setup & Local Development

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vinayakyeti/nextjsTask.git
   cd nextjsTask/task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create `.env.local` file in the project root:
   ```
   # Database
   DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/interview-prep-hub?retryWrites=true&w=majority&appName=Cluster0"
   
   # NextAuth Configuration
   NEXTAUTH_SECRET="your-random-secret-key-min-32-chars"
   NEXTAUTH_URL="http://localhost:3000"
   
   # App Configuration
   NODE_ENV="development"
   ```

   **To generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

5. **Seed database (optional - adds demo data)**
   ```bash
   npm run db:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to MongoDB |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed database with demo data |
| `npm run lint` | Run ESLint |
| `npm run test:unit` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:coverage` | Generate coverage report |

## Testing

### Unit Tests
```bash
npm run test:unit
```
Tests validate:
- Zod validation schemas
- Error handling
- Data transformation logic
- Utility functions

### End-to-End Tests
```bash
npm run test:e2e
```
Tests cover:
- User authentication flow
- Question CRUD operations
- Collection management
- Navigation and routing
- Error scenarios

### Test Coverage
```bash
npm run test:coverage
```
Target: >80% coverage on critical paths

### Manual Testing Checklist
- ✅ Signup with new email/password
- ✅ Login with correct and incorrect credentials
- ✅ Create question with all fields
- ✅ Edit existing question
- ✅ Delete question
- ✅ Create collection
- ✅ Add questions to collection
- ✅ Remove questions from collection
- ✅ View questions with pagination
- ✅ Filter by difficulty level
- ✅ Responsive design on mobile/tablet/desktop
- ✅ Logout redirects to login page

## Deployment

### Live Application
🔗 **URL:** [https://interviewprephub-rho.vercel.app](https://interviewprephub-rho.vercel.app)

### Deployment Process

**Platform:** Vercel (auto-deploy on git push)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your message"
   git push origin master
   ```

2. **Automatic Deployment**
   - GitHub webhook triggers Vercel build
   - Prisma Client generated
   - TypeScript compiled
   - Next.js optimized build created
   - Deployed to CDN

3. **Deployment Status**
   - Check: [Vercel Dashboard](https://vercel.com/dashboard)
   - View deployment logs and errors
   - Rollback previous versions if needed

### Environment Setup on Vercel
1. Go to Project Settings → Environment Variables
2. Add `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
3. Values automatically used in production builds

### Performance
- **Build Time:** ~30-45 seconds
- **First Contentful Paint:** <1.5s
- **Lighthouse Score:** 90+ (Performance, Accessibility, Best Practices)

### CI/CD Pipeline
- Automatic testing on pull requests (GitHub Actions)
- Build verification before deployment
- Automatic deploy on merge to master
- Zero-downtime deployments

## Security & Real-World Considerations

### Authentication & Authorization
| Risk | Mitigation |
|------|-----------|
| **Weak Passwords** | Client-side validation + server-side enforcement (min 6 chars) |
| **SQL/NoSQL Injection** | Prisma parameterized queries + Zod validation |
| **Session Hijacking** | JWT tokens + HttpOnly cookies + CSRF protection |
| **Brute Force Attacks** | Rate limiting (5 requests/15 min per IP) |
| **Password Storage** | bcryptjs with 10 salt rounds (industry standard) |

### Data Protection
| Risk | Mitigation |
|------|-----------|
| **Unauthorized Access** | Middleware validates auth on protected routes |
| **Data Leakage** | Server Actions isolate backend logic from client |
| **Database Exposure** | MongoDB Atlas with IP whitelist + encrypted connection |
| **Plaintext Secrets** | Environment variables for sensitive data |

### API Security
| Risk | Mitigation |
|------|-----------|
| **XSS (Cross-Site Scripting)** | React auto-escapes content + CSP headers |
| **CSRF** | NextAuth.js built-in CSRF token protection |
| **Information Disclosure** | Generic error messages (no stack traces to client) |
| **Input Validation** | Zod schemas validate all user inputs |

### Infrastructure Security
| Risk | Mitigation |
|------|-----------|
| **DDoS** | Vercel CDN + automatic rate limiting |
| **Unencrypted Traffic** | HTTPS enforced (TLS 1.2+) |
| **Dependency Vulnerabilities** | npm audit, automated security updates |
| **Configuration Leaks** | .env.local in .gitignore (never committed) |

### Code Quality
- TypeScript strict mode prevents type-related bugs
- ESLint enforces consistent code standards
- Server-side validation prevents malicious input
- Error handling with proper logging
- No hardcoded secrets or credentials

### Performance Considerations
- Pagination on question lists (prevents memory issues)
- Indexed MongoDB queries for faster lookups
- Optimistic UI updates for better UX
- Lazy loading of collections
- Asset compression via Vercel CDN

### Scalability
- **Horizontal Scaling:** Stateless server actions work on multiple instances
- **Database Optimization:** Indexed queries, connection pooling via Prisma
- **Caching:** Vercel edge caching for static content
- **Load Distribution:** CDN serves assets from edge locations globally

### Monitoring & Logging
- Server-side error logging with timestamps
- Error context in console (dev only)
- Vercel Analytics for traffic patterns
- Sentry integration ready (optional enhancement)

## Future Improvements

### Phase 1: Enhanced Features
- [ ] Difficulty level analysis and recommendations
- [ ] Question search with full-text indexing
- [ ] Export collections as PDF/markdown
- [ ] Practice timer for timed sessions
- [ ] Question statistics and metrics

### Phase 2: Social & Collaboration
- [ ] Share collections with other users (read-only)
- [ ] Community question library
- [ ] User ratings and comments on questions
- [ ] Discussion forums per collection

### Phase 3: Analytics & Insights
- [ ] Practice session tracking with analytics
- [ ] Progress dashboard with charts
- [ ] Performance metrics by difficulty
- [ ] Recommended practice schedule

### Phase 4: Advanced Features
- [ ] Spaced repetition algorithm for optimal review timing
- [ ] Mock interview simulations
- [ ] Video recording of practice answers
- [ ] Integration with LinkedIn for profile enhancement

### Phase 5: Platform Expansion
- [ ] Mobile apps (iOS/Android)
- [ ] Browser extensions for saving interview questions
- [ ] API for third-party integrations
- [ ] Admin dashboard for content moderation

## Project Structure

```
interview-prep-hub/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── questions/
│   │   ├── collections/
│   │   └── layout.tsx
│   ├── actions/             # Server Actions
│   ├── api/                 # API routes
│   ├── components/          # Reusable React components
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── validations.ts      # Zod schemas
│   ├── logger.ts           # Logging utility
│   ├── errors.ts           # Error types
│   └── rate-limit.ts       # Rate limiting
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding
├── __tests__/              # Test files
│   ├── unit/
│   └── integration/
├── public/                 # Static assets
├── .env.local             # Local environment variables
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-source and available under the MIT License.

## Contact & Support

For questions, issues, or suggestions:
- **GitHub Issues:** [Create an issue](https://github.com/Vinayakyeti/nextjsTask/issues)
- **Email:** vinayakyeti3219@gmail.com
- **LinkedIn:** [Vinayak Tiwari](https://www.linkedin.com/in/vinayak-tiwari15/)

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

Last updated: December 2025
