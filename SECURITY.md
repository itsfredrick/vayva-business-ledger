# PureWater Ledger Security Policy

## Security Assumptions

- **Cloud Environment**: This application is designed to be hosted on a platform like Vercel with a managed database (e.g., Supabase PostgreSQL).
- **Authentication**: NextAuth.js is used for session management. Sessions are stored in secure, HTTP-only cookies.
- **Role-Based Access Control (RBAC)**: 
    - `STAFF`: Can perform daily operations (drivers, sales, expenses, inventory).
    - `OWNER`: Full access to all reports, audit logs, and can approve overrides (unlock requests).
- **Environment Variables**: All sensitive keys (NEXTAUTH_SECRET, DATABASE_URL) must be managed via production environment variables.

## Implemented Security Measures

### 1. Rate Limiting
- Login attempts are rate-limited to 5 failures per 15 minutes per email to prevent brute-force attacks.

### 2. Password Hashing
- All user passwords are hashed using `bcryptjs` with a cost factor of 10.

### 3. Comprehensive Audit Trail
- Every system mutation (Create, Update, Delete, Close, Unlock, Match) is recorded in the `AuditLog` table.
- Logs include: `user`, `entityId`, `action`, `oldState`, `newState`, and `timestamp`.
- Owners can view the full history in the **Audit Log Explorer**.

### 4. RBAC & IDOR Prevention
- Server-side role checks are enforced for every sensitive route and server action using `validateAction` and `requireRole`.
- Indirect Object Reference (IDOR) attacks are mitigated by ensuring actions are scoped to the authenticated user's organization and current day context.

### 5. Input Validation
- All server actions validate inputs using `zod` schemas to prevent malformed data or injection attacks.

## Vulnerability Reporting

If you find a security vulnerability, please do NOT open a public issue. Instead, email the system administrator directly at security@purewaterledger.com (placeholder).

## Responsible Disclosure

We appreciate your help in keeping PureWater Ledger secure. We will acknowledge receipt of your report and provide a timeline for resolution if sensitive information is involved.
