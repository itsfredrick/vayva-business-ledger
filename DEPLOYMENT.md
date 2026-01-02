# Kool Joo Business Ledger - Deployment Guide

This guide explains how to deploy **Kool Joo Business Ledger** to GitHub and Vercel.

## 1. GitHub Setup

### Initialize Repository
If you haven't already, turn your local project into a Git repository:

```bash
git init
git add .
git commit -m "Initial commit: Kool Joo Business Ledger"
```

### Push to GitHub
1. Create a new **Private** repository on [GitHub](https://github.com/new).
2. Follow the instructions on GitHub to add the remote and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 2. Database Choice (Critical)

**SQLite is not supported on Vercel** for persistent data because Vercel's filesystem is ephemeral (it resets frequently). You must use a hosted database.

### Recommendation: Vercel Postgres (Powered by Neon)
The easiest way is to use the **Storage** tab in your Vercel Dashboard:
1. Go to your project in Vercel.
2. Click the **Storage** tab.
3. Select **CREATE DATABASE** -> **Postgres**.
4. This will automatically add the `DATABASE_URL` and other secrets to your Environment Variables.

**IMPORTANT: Pre-Deployment Code Change**
You must change your database provider in `prisma/schema.prisma` before pushing to GitHub:

```prisma
datasource db {
  provider = "postgresql" // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

### Optional: Vercel Blob (For Images/Files)
If you plan to allow users to upload receipts or profile photos:
1. In the same **Storage** tab, select **CREATE DATABASE** -> **Blob**.
2. This creates a high-performance cloud storage bucket for your files.

---

## 3. Vercel Deployment

1. Go to [Vercel](https://vercel.com/new) and **Import** your GitHub repository.
2. **Configure Project Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
3. **Add Environment Variables**:
   If you didn't use the automatic storage setup, add these manually:

| Variable | Description | Value Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Your Postgres connection string | `postgres://user:pass@ep-host.region.neon.tech/neondb` |
| `AUTH_SECRET` | Secret key for Auth.js | Run `openssl rand -base64 32` locally |
| `AUTH_URL` | Your production URL | `https://kooljoo-water.vercel.app` |

4. **Deploy**: Click "Deploy". Vercel will automatically run `npm run build` and `prisma generate`.

---

## 4. Post-Deployment Steps

### Initialize Production Database
Once Vercel is connected to your database, run this locally to push your schema and seed the initial users:

```bash
# Push schema to production
npx prisma db push

# Seed production users (Owner/Staff)
npx tsx prisma/seed.ts
```

*Note: Ensure your local `.env` is temporarily pointed to the production `DATABASE_URL` when running these commands, or use Vercel CLI.*

---

## 5. Maintenance
- **Schema Updates**: When you change `schema.prisma`, run `npx prisma db push` or use migrations.
- **Backups**: Ensure your DB provider has automated backups enabled (Neon does this by default).
