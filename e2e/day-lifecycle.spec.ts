
import { test, expect } from '@playwright/test';

test.describe('Day Lifecycle & Operations', () => {

    test('should allow owner to login and verify dashboard', async ({ page }) => {
        // 1. Visit Protected Page to trigger redirect
        await page.goto('/app/dashboard');
        // Should be redirected to login
        await expect(page).toHaveURL(/.*\/login/);
        await page.fill('input[name="email"]', 'owner@purewater.com');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');

        // 2. Verify Dashboard
        await expect(page).toHaveURL('/app/dashboard');
        await expect(page.getByText('Chief Owner')).toBeVisible();

        // 3. Check Status
        // Depending on seed state, day might be open.
        // We expect "Day Open" or "Day Closed" badge.
        const status = page.getByTestId('day-status-indicator');
        await expect(status).toBeVisible();

        // 4. Navigate to Drivers
        await page.click('a[href="/app/drivers"]');
        await expect(page).toHaveURL('/app/drivers');

        // 5. Verify Today Page UI (New Refactor)
        await page.goto('/app/today');
        await expect(page.getByText('Daily Book')).toBeVisible();
        await expect(page.getByText('Day Summary')).toBeVisible(); // Sticky Summary Title
    });

    // More complex flows would require resetting DB state before test, 
    // ensuring a fresh day can be opened, etc.
    // For this tasks scope, we verify critical paths exist.
});
