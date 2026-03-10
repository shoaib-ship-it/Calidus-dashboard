import { test, expect } from '@playwright/test';
import { switchRole, dismissToasts } from '../fixtures/helpers';

const BASE_URL = 'https://dashboard-roles-ui.preview.emergentagent.com';

test.describe('Core Flows - Navigation & Role Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await dismissToasts(page);
  });

  test('app loads with admin role by default', async ({ page }) => {
    // Role selector shows Admin
    const roleSelector = page.getByTestId('role-selector');
    await expect(roleSelector).toBeVisible();
    await expect(roleSelector).toContainText('Admin');

    // Admin overview is visible
    await expect(page.getByTestId('admin-overview')).toBeVisible();
  });

  test('role selector switches to Supplier dashboard', async ({ page }) => {
    await switchRole(page, 'supplier');

    // Sidebar nav changes to supplier items
    await expect(page.getByTestId('nav-overview')).toBeVisible();
    await expect(page.getByTestId('nav-profile')).toBeVisible();
    await expect(page.getByTestId('nav-enquiries')).toBeVisible();

    // Supplier overview is shown
    await expect(page.getByTestId('supplier-overview')).toBeVisible();
  });

  test('role selector switches to Buyer dashboard', async ({ page }) => {
    await switchRole(page, 'buyer');

    // Sidebar nav changes to buyer items
    await expect(page.getByTestId('nav-overview')).toBeVisible();
    await expect(page.getByTestId('nav-enquiries')).toBeVisible();
    await expect(page.getByTestId('nav-profile')).toBeVisible();

    // Buyer overview is shown
    await expect(page.getByTestId('buyer-overview')).toBeVisible();
  });

  test('admin sidebar navigation items are correct', async ({ page }) => {
    // Admin role is default
    await expect(page.getByTestId('nav-overview')).toBeVisible();
    await expect(page.getByTestId('nav-suppliers')).toBeVisible();
    await expect(page.getByTestId('nav-products')).toBeVisible();
    await expect(page.getByTestId('nav-ratings')).toBeVisible();
    await expect(page.getByTestId('nav-categories')).toBeVisible();
    await expect(page.getByTestId('nav-buyers')).toBeVisible();
    await expect(page.getByTestId('nav-analytics')).toBeVisible();
  });

  test('header elements are always visible', async ({ page }) => {
    await expect(page.getByTestId('global-search-input')).toBeVisible();
    await expect(page.getByTestId('notifications-btn')).toBeVisible();
    await expect(page.getByTestId('messages-btn')).toBeVisible();
    await expect(page.getByTestId('user-menu-btn')).toBeVisible();
  });

  test('user menu dropdown opens and shows options', async ({ page }) => {
    await page.getByTestId('user-menu-btn').click();
    await expect(page.getByTestId('user-menu-profile')).toBeVisible();
    await expect(page.getByTestId('user-menu-settings')).toBeVisible();
    await expect(page.getByTestId('user-menu-logout')).toBeVisible();
  });

  test('sidebar toggle collapses and expands sidebar', async ({ page }) => {
    const toggleBtn = page.getByTestId('sidebar-toggle-btn');
    await expect(toggleBtn).toBeVisible();
    // Click to collapse
    await toggleBtn.click({ force: true });
    // Sidebar collapses - text labels should not be visible
    await expect(page.locator('aside').first().locator('span').filter({ hasText: 'Supplier Management' })).not.toBeVisible();
    // Click again to expand
    await toggleBtn.click({ force: true });
    await expect(page.getByTestId('nav-suppliers').locator('span')).toBeVisible();
  });

  test('role switching resets active section to overview', async ({ page }) => {
    // Navigate to a different section
    await page.getByTestId('nav-suppliers').click();
    await expect(page.getByTestId('supplier-management')).toBeVisible();

    // Switch role - should reset to overview
    await switchRole(page, 'supplier');
    await expect(page.getByTestId('supplier-overview')).toBeVisible();
  });
});
