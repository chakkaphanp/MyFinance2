# MyFinance - Personal Finance Tracker

A modern full-stack web application for tracking personal financial transactions with daily spending/receiving and monthly analytics.

## Features

- **User Authentication**: Secure JWT-based authentication with registration and login
- **Transaction Management**: Add, view, update, and delete transactions
- **Income & Expense Tracking**: Track income and expenses separately
- **Dashboard**: 
  - Real-time financial statistics (balance, monthly income/expense)
  - Monthly trend visualization
  - Category-wise expense breakdown
  - Interactive charts and graphs
- **Transaction History**: Detailed list of all transactions with filtering and pagination
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **TypeScript** - Type-safe code
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe components
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Zustand** - State management
- **Axios** - HTTP client

## Project Structure

```
MyFinance/
├── backend/               # Express API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth & error handling
│   │   └── index.ts      # App entry point
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   ├── store/        # Zustand stores
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   └── package.json
└── shared/               # Shared types
    └── types.ts
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation & Setup

### 1. Database Setup

Create a PostgreSQL database:
```bash
createdb myfinance
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Run database migrations
npm run db:push

# Start the development server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions (paginated)
- `GET /api/transactions/:id` - Get transaction by ID
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Dashboard
- `GET /api/dashboard/stats` - Get overall statistics
- `GET /api/dashboard/category-breakdown` - Get expense breakdown by category
- `GET /api/dashboard/monthly-trend` - Get income/expense trends

## Usage

1. **Register**: Create a new account on the registration page
2. **Login**: Sign in with your credentials
3. **Add Transaction**: Click "Add Transaction" button to record a transaction
4. **View Dashboard**: See your financial overview with charts
5. **View Transactions**: Browse your transaction history
6. **Manage Transactions**: Edit or delete transactions as needed

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/myfinance
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=3000
```

## Development

### Database Migrations
```bash
# Create a new migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio
```

### Building for Production

Backend:
```bash
npm run build
npm start
```

Frontend:
```bash
npm run build
npm run preview
```

## Features to Add (Future Enhancements)

- Budget setting and tracking
- Bill reminders and recurring transactions
- Multi-currency support
- CSV export functionality
- Receipt upload and storage
- Multiple account support
- Advanced analytics and reports
- Mobile app (React Native)

## Security Considerations

- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- Protected API endpoints require authentication
- CORS is configured for cross-origin requests
- Input validation on all endpoints

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.
