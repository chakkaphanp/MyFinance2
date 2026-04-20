# Frontend Deployment Guide - Vercel

## Prerequisites
- Node.js and npm installed locally
- GitHub account
- Vercel account (free tier available)

## Step 1: Prepare Your Frontend

Your frontend is already configured with the required Vercel settings. The setup includes:
- ✅ `vercel.json` - Vercel configuration with proper SPA rewrites
- ✅ `.env.example` - Environment variable template
- ✅ Environment variable support in `src/services/api.ts`

## Step 2: Set Up Git Repository (if not already done)

```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/myfinance-frontend.git
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign up/log in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Framework**: Select "Vite"
5. **Root Directory**: Select "./frontend" (if monorepo) or leave empty
6. **Build Command**: `npm run build` (already set)
7. **Output Directory**: `dist` (already set)
8. **Environment Variables**: Add the following:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.com/api`)
9. Click "Deploy"

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 4: Configure Environment Variables on Vercel

After initial deployment:

1. Go to your project on Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend API URL (e.g., `https://backend-api.herokuapp.com/api`)
   - **Select Environments**: Production, Preview, Development

## Step 5: Update Your Backend API URL

Once your backend is deployed (e.g., on Heroku, Railway, or another service):

1. Update the `VITE_API_URL` environment variable on Vercel with your actual backend URL
2. The frontend will automatically rebuild and redeploy

## Example Environment Variables

- **Development**: `http://localhost:3000/api`
- **Production**: `https://my-backend-api.com/api`

## Important Notes

⚠️ **CORS Configuration**: Ensure your backend has CORS enabled for your Vercel deployment URL:
```javascript
// In your backend (index.ts or similar)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-vercel-domain.vercel.app',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

⚠️ **SPA Routing**: The `vercel.json` file ensures all routes are served by `index.html` for React Router to handle.

## Troubleshooting

### Build fails
- Clear cache: In Vercel dashboard → Project Settings → Advanced → Caches
- Check that `VITE_API_URL` is set correctly

### API calls fail
- Check browser console for CORS errors
- Verify `VITE_API_URL` environment variable is set
- Ensure backend CORS settings allow your Vercel domain

### Blank page on load
- Check the `vercel.json` rewrites configuration
- Verify build output directory is `dist`

## Next Steps

1. Deploy your backend to a hosting platform (Heroku, Railway, Render, etc.)
2. Update `VITE_API_URL` on Vercel with your backend URL
3. Test the complete application

---

For more info: [Vercel Docs](https://vercel.com/docs) | [Vite Docs](https://vitejs.dev)
