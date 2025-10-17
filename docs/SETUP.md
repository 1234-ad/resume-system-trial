# Resume System - Setup Guide

## Prerequisites

- **Node.js** 18 or higher
- **PostgreSQL** 14 or higher
- **Docker** and **Docker Compose** (recommended)
- **npm** or **yarn**

## Quick Start with Docker (Recommended)

The easiest way to run the entire application:

```powershell
# Clone the repository
git clone <repository-url>
cd resume-system-trial

# Start all services
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3001
- Frontend app on port 3000

Open http://localhost:3000 in your browser.

## Manual Setup (Without Docker)

### 1. Database Setup

Create PostgreSQL database:

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE resume_system;

# Exit psql
\q

# Apply schema
psql -U postgres -d resume_system -f database/schema.sql
```

### 2. Backend Setup

```powershell
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_system
# JWT_SECRET=your-secret-key
# PORT=3001

# Run development server
npm run dev

# Or build and run production
npm run build
npm start
```

The backend will be available at http://localhost:3001

### 3. Frontend Setup

```powershell
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at http://localhost:3000

## Environment Variables

### Backend (.env)

```env
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_system
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=sk-your-key-here (optional)
```

### Frontend

The frontend uses proxy configuration in `vite.config.ts` to connect to the backend API.

## Testing the API

### Health Check

```powershell
curl http://localhost:3001/health
```

### Register a User

```powershell
curl -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### Login

```powershell
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"test123"}'
```

### Generate AI Summary

```powershell
curl -X POST http://localhost:3001/api/ai/generate-summary `
  -H "Content-Type: application/json" `
  -d '{"achievements":[{"title":"Software Engineer","type":"internship"}]}'
```

## Project Structure

```
resume-system-trial/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── db/             # Database connection
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Type definitions
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── index.ts        # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx        # Main component
│   │   ├── App.css        # Styles
│   │   └── main.tsx       # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── database/
│   └── schema.sql         # Database schema
│
├── ai-engine/
│   └── summary.ts         # AI summary generation
│
├── docs/
│   └── API.md            # API documentation
│
└── docker-compose.yml    # Docker orchestration
```

## Troubleshooting

### Port Already in Use

If ports 3000, 3001, or 5432 are already in use:

```powershell
# Windows - Find and kill process
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env
3. Verify database exists: `psql -U postgres -l`
4. Check connection: `psql -U postgres -d resume_system`

### TypeScript Errors

```powershell
cd backend
npm install
npm run build
```

### Module Not Found Errors

```powershell
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Backend Development

```powershell
cd backend
npm run dev  # Auto-restart on file changes
```

### Frontend Development

```powershell
cd frontend
npm run dev  # Hot reload enabled
```

### Database Changes

After modifying schema.sql:

```powershell
psql -U postgres -d resume_system -f database/schema.sql
```

## Production Deployment

### Building for Production

```powershell
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Using Docker Compose in Production

```powershell
docker-compose up -d  # Detached mode
docker-compose logs -f  # View logs
docker-compose down  # Stop services
```

## Next Steps

1. Configure OpenAI API key for real AI summaries
2. Add more resume templates
3. Implement PDF export
4. Add email verification
5. Set up CI/CD pipeline
6. Deploy to cloud (AWS, Azure, GCP)

## Support

For issues and questions:
- Check API documentation: `docs/API.md`
- Review error logs
- Ensure all dependencies are installed
