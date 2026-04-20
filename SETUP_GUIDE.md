# MyFinance - Quick Start Guide

## Prerequisites
- Node.js 18+ (download from https://nodejs.org/)
- PostgreSQL 12+ (download from https://www.postgresql.org/download/)
- Git (optional, for version control)

## Step 1: Setup PostgreSQL Database

### On Windows:
1. Start PostgreSQL Server (usually starts automatically)
2. Open pgAdmin 4 or use Command Line
3. Create a new database:
   ```sql
   CREATE DATABASE myfinance;
   CREATE USER myfinance_user WITH PASSWORD 'myfinance_password';
   ALTER ROLE myfinance_user SET client_encoding TO 'utf8';
   ALTER ROLE myfinance_user SET default_transaction_isolation TO 'read committed';
   ALTER ROLE myfinance_user SET default_transaction_deferrable TO on;
   GRANT ALL PRIVILEGES ON DATABASE myfinance TO myfinance_user;
   ```

### On macOS (with Homebrew):
```bash
brew install postgresql
brew services start postgresql
createdb myfinance
```

### On Linux (Ubuntu):
```bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createdb myfinance
```

## Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://myfinance_user:myfinance_password@localhost:5432/myfinance

# Install dependencies
npm install

# Run database migrations
npm run db:push

# Start backend server
npm run dev
```

The backend will run on **http://localhost:3000**

## Step 3: Setup Frontend

In a new terminal:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

The frontend will run on **http://localhost:5173**

## Step 4: Access the Application

1. Open http://localhost:5173 in your browser
2. Click "Sign up" to create a new account
3. Fill in your details:
   - Full Name: Your name
   - Email: your-email@example.com
   - Password: Your password
4. Click "Create Account"
5. You'll be redirected to the Dashboard

## Common Tasks

### View Database (Prisma Studio)
```bash
cd backend
npm run db:studio
```
Opens browser interface to view/edit database data

### Build for Production

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

### Reset Database
```bash
cd backend
npx prisma migrate reset
npm run db:push
```

## Troubleshooting

### PostgreSQL Connection Error
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env is correct
- Ensure database and user exist

### Port Already in Use
- Backend: Change PORT in .env or kill process on port 3000
- Frontend: Vite will automatically use next available port

### CORS Error
- Ensure backend proxy is configured in vite.config.ts
- Backend CORS is enabled in index.ts

### Dependencies Installation Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Project Features

✅ User Registration & Login
✅ Add Income/Expense Transactions
✅ View Transaction History
✅ Dashboard with Real-time Statistics
✅ Monthly Income/Expense Trends
✅ Category Breakdown Charts
✅ Responsive Design
✅ Secure JWT Authentication

## Next Steps

1. Explore the Dashboard to view your financial overview
2. Add some test transactions to see the charts populate
3. Check out the code structure in both backend and frontend folders
4. Customize styling in frontend/src/index.css
5. Add more features as needed!

## Support

For detailed information, see README.md
