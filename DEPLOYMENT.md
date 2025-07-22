# PocketTrack Deployment Guide

## Overview
Your PocketTrack app is ready for serverless deployment on multiple platforms. The app uses React frontend with Express.js backend and PostgreSQL database.

## Option 1: Vercel Deployment (Recommended)

### Prerequisites
1. GitHub account with your code repository
2. Vercel account (free tier available)
3. Database provider (Neon, Supabase, or PlanetScale)

### Step-by-Step Deployment

#### 1. Database Setup
**Option A: Neon (Recommended for PostgreSQL)**
- Visit https://neon.tech and create account
- Create new PostgreSQL database
- Copy connection string (starts with `postgresql://`)

**Option B: Supabase**
- Visit https://supabase.com and create project
- Go to Settings > Database and copy connection string

#### 2. Deploy to Vercel
1. Push your code to GitHub repository
2. Visit https://vercel.com and sign in
3. Click "New Project" and import your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: `production`
5. Override build command: `npm run build:vercel` (if script added)
6. Set output directory: `dist/public`
7. Click "Deploy"

#### 3. Database Migration
After deployment, run database migration:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with environment variables
vercel env add DATABASE_URL
# Paste your database connection string

# Push database schema
npx drizzle-kit push
```

### Configuration Files
- `vercel.json` - Already created for optimal routing
- `api/index.ts` - Serverless API handler

---

## Option 2: Netlify Deployment

### Setup Steps
1. Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist/public"

[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. Create `netlify/functions/api.ts`:
```typescript
import { Handler } from '@netlify/functions'
import serverlessHttp from 'serverless-http'
import app from '../../api/index'

export const handler: Handler = serverlessHttp(app)
```

---

## Option 3: Railway Deployment

Railway supports full-stack applications with built-in PostgreSQL.

### Setup Steps
1. Visit https://railway.app and create account
2. Click "New Project" > "Deploy from GitHub"
3. Select your repository
4. Add PostgreSQL service to your project
5. Environment variables are auto-configured
6. Deploy automatically handles build and start commands

---

## Option 4: Render Deployment

### Setup Steps
1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: pockettrack-app
    env: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: pockettrack-db
          property: connectionString

databases:
  - name: pockettrack-db
    databaseName: pockettrack
    user: pockettrack_user
```

---

## Environment Variables Required

All platforms need these environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to `production`

## Database Providers Comparison

| Provider | Free Tier | PostgreSQL | Serverless | Setup Difficulty |
|----------|-----------|------------|------------|------------------|
| Neon | ✅ 3GB | ✅ | ✅ | Easy |
| Supabase | ✅ 500MB | ✅ | ✅ | Easy |
| PlanetScale | ✅ 1GB | ❌ MySQL | ✅ | Medium |
| Railway | ✅ 1GB | ✅ | ❌ | Easy |

## Post-Deployment Checklist

1. ✅ Database connection working
2. ✅ API endpoints responding
3. ✅ Frontend assets loading
4. ✅ Database schema pushed (`npm run db:push`)
5. ✅ Seed data populated (optional)
6. ✅ Environment variables configured
7. ✅ HTTPS enabled (automatic on most platforms)

## Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Verify DATABASE_URL is correctly set
   - Check database provider status
   - Ensure IP allowlisting (if required)

2. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Review build logs for specific errors

3. **API Routes Not Working**
   - Confirm routing configuration
   - Check serverless function deployment
   - Verify environment variables

### Debugging Commands
```bash
# Check environment variables
echo $DATABASE_URL

# Test database connection
npm run db:push

# Build locally
npm run build

# Test production build
npm start
```

## Performance Optimization

### For Production
1. Enable database connection pooling
2. Add CDN for static assets
3. Configure caching headers
4. Monitor database query performance
5. Set up error tracking (Sentry)

### Cost Optimization
1. Choose appropriate database tier
2. Monitor function execution time
3. Optimize bundle size
4. Use edge functions when possible

---

## Next Steps After Deployment

1. Set up custom domain (if needed)
2. Configure monitoring and alerts  
3. Set up backup strategy
4. Plan for scaling (if usage grows)
5. Add CI/CD pipeline for automated deployments

Your app is production-ready with these configurations!