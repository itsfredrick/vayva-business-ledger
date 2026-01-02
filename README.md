# Vayva Business Ledger

A comprehensive business management system for water factories, built with Next.js, Prisma, and TailwindCSS.

## Deployment

Follow the [Deployment Guide](./DEPLOYMENT.md) for instructions on hosting this app on GitHub and Vercel.

## Features

- **Role-Based Access**: Owner and Staff roles with specific permissions.
- **Daily Lifecycle**: Open/Close day workflows, audit logging, and unlock requests.
- **Driver Management**: Track daily trips, loaded/sold bags, commissions, and outstanding balances.
- **Office Sales**: Record direct factory sales (Cash/Transfer).
- **Dispenser Module**: Manage dispenser customers, deliveries, and monthly billing.
- **Inventory Tracking**: Monitor production, spoilage, and stock variance.
- **Expense Tracking**: Categorized expenses, petty cash management, and owner reviews.
- **Offline-First**: Mobile-optimized PWA with background sync for key operations.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: SQLite (Dev) / Postgres (Prod recommended) via Prisma ORM
- **UI**: TailwindCSS, shadcn/ui
- **State/Sync**: Dexie.js (IndexedDB) & custom offline hooks
- **Form Handling**: React Hook Form + Zod

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   ```bash
   npx prisma migrate dev
   npx tsx scripts/seed-demo.ts # Seeds full demo dataset
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access App**
   - URL: `http://localhost:3000`
   - Owner: Username: `owner` / Password: `password123`
   - Staff: Username: `staff` / Password: `password123`

## Key Workflows

- **Starting a Day**: Owner or authorized Staff opens the day from the Dashboard.
- **Drivers**: Staff assigns drivers to the day, records trips and returns. System auto-calculates expected cash.
- **Closing**: Staff submits closing cash and inventory. Owner reviews any variances.

## License

Private.
