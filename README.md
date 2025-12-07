# Interview Prep Hub

A full-stack technical interview preparation platform with question management, AI-powered feedback, and practice tracking.

## 🎯 Features

- **Question Management**: Create, edit, and organize technical interview questions
- **Collections**: Group questions into custom collections for organized studying
- **AI Feedback**: Get AI-powered feedback on interview answers using Gemini API
- **Practice Sessions**: Track your practice history and performance
- **Authentication**: Secure user authentication with NextAuth.js
- **Responsive Design**: Modern UI built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions, API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Validation**: Zod
- **AI Integration**: Google Gemini API

## 📁 Project Structure

```
app/
├── (auth)/                  # Authentication pages
├── (dashboard)/             # Protected dashboard
│   ├── collections/         # Collection management
│   ├── questions/           # Question management
│   └── dashboard/           # Main dashboard
├── actions/                 # Server Actions
├── api/                     # API Routes
└── components/              # Reusable components

lib/
├── prisma.ts               # Prisma client
├── validations.ts          # Zod schemas
├── ai.ts                   # AI integration
└── logger.ts               # Logging utilities

prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Database seed data
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key (optional, for AI features)

### Installation

```bash
# Clone repository
git clone https://github.com/Vinayakyeti/nextjsTask.git
cd nextjsTask/task

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Setup database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/dbname"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AI (Optional - for answer feedback)
AI_API_KEY="your-gemini-api-key"
AI_PROVIDER="gemini"  # or "openai", "groq"
```

## 📝 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run db:generate      # Generate Prisma Client
npm run db:push          # Sync schema to MongoDB
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio
```

## 👤 Demo Account

Use these credentials to test the application:

```
Email: demo@example.com
Password: password123
```

## 📚 Database Collections

- **User**: User accounts and authentication
- **Question**: Technical interview questions
- **Collection**: Custom question groupings
- **PracticeSession**: Interview practice tracking
- **Company**: Company information for questions

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signin` - Login
- `POST /api/auth/signup` - Register
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Logout

### Questions
- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Collections
- `GET /api/collections` - Get all collections
- `POST /api/collections` - Create collection
- `GET /api/collections/:id` - Get collection details
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection

## 👨‍💻 Author

Built by **Vinayak**

- GitHub: [@Vinayakyeti](https://github.com/Vinayakyeti)
- LinkedIn: [vinayak-tiwari15](https://www.linkedin.com/in/vinayak-tiwari15/)

## 📄 License

This project is open source and available under the MIT License.
