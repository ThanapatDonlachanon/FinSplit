# FinSplit Deployment Guide

Deploy your FinSplit app to Vercel with a free PostgreSQL database.

## Prerequisites
- GitHub account (for connecting to Vercel)
- Vercel account (free)

## Step 1: Push Code to GitHub

1. Initialize git if not already done:
```bash
cd fin_split
git init
git add .
git commit -m "Initial commit: FinSplit app"
```

2. Create a new repository on GitHub (https://github.com/new)
   - Name: `finsplit`
   - Don't initialize with README (we have one)

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/finsplit.git
git branch -M main
git push -u origin main
```

## Step 2: Create Vercel Project

1. Go to https://vercel.com and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

## Step 3: Create Vercel Postgres Database

Since @vercel/postgres is deprecated, we'll use Neon (native Vercel integration):

1. In your Vercel project settings, go to **Storage**
2. Click **Create Database** → **Postgres** → **Neon**
3. Create a new Neon project (free tier)
4. Vercel will automatically set `DATABASE_URL` environment variable

## Step 4: Run Database Migrations

After the database is created:

1. In Vercel, go to your project → **Settings** → **Environment Variables**
2. Verify `DATABASE_URL` is set (Vercel does this automatically with Neon)

3. In your local machine, generate Prisma Client:
```bash
npx prisma generate
```

4. Create and run migrations:
```bash
npx prisma migrate dev --name init
```

This will:
- Create the migration files
- Apply schema to your database
- Generate Prisma Client

## Step 5: Deploy with Updated Code

1. Commit your migration files:
```bash
git add prisma/migrations
git commit -m "Add database migrations"
git push
```

Vercel will auto-redeploy. The app is now live!

## Step 6: Access Your App

Your app is now live at: `https://YOUR_PROJECT_NAME.vercel.app`

## Database Management

### View Database
```bash
npx prisma studio
```
This opens a GUI to view/edit your database locally.

### Make Schema Changes
1. Edit `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name describe_change`
3. Commit and push to deploy

### Connect to Neon Console
- Go to https://console.neon.tech
- Use the connection string from Vercel's environment variables

## Environment Variables

The following are automatically set by Vercel:
- `DATABASE_URL` - PostgreSQL connection string

You may want to add:
- `NEXT_PUBLIC_APP_URL` - Set to your Vercel URL
- `NODE_ENV` - Automatically set to `production`

## Free Tier Limits

**Vercel:**
- 100 GB bandwidth/month
- 12 serverless function executions/second
- Unlimited deployments

**Neon Postgres:**
- 0.5 GiB storage
- 3 GB/month data transfer
- 1 project, 1 compute endpoint

## Troubleshooting

### Database connection fails
- Verify `DATABASE_URL` is set in Vercel environment
- Check Neon dashboard for any database issues
- Run locally first: `npx prisma db push`

### Deploy fails
- Check deployment logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

### Need more database space?
Neon offers paid tiers if you exceed free limits.

## Next Steps

1. **Auto-sync data to database** - Currently the app uses localStorage. Next phase would be to:
   - Create API routes for CRUD operations
   - Add authentication middleware
   - Auto-sync user data to Postgres
   - Remove dependency on localStorage

2. **Add backup strategy** - Set up automated backups in Neon console

3. **Monitor performance** - Use Vercel Analytics to monitor usage

## Support

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://www.prisma.io/docs
