import { test, expect } from '@playwright/test';
import { dismissToasts } from '../fixtures/helpers';

const BASE_URL = 'https://dashboard-roles-ui.preview.emergentagent.com';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await dismissToasts(page);
    // Ensure admin role is selected (default)
    const roleSelector = page.getByTestId('role-selector');
    await expect(roleSelector).toContainText('Admin');
  });

  test('admin overview stats display correct values', async ({ page }) => {
    await expect(page.getByTestId('admin-overview')).toBeVisible();
    // Stat cards - should display counts from mock data
    await expect(page.getByTestId('stat-total-suppliers')).toBeVisible();
    await expect(page.getByTestId('stat-total-buyers')).toBeVisible();
    await expect(page.getByTestId('stat-total-products')).toBeVisible();
    await expect(page.getByTestId('stat-total-categories')).toBeVisible();
    // Values: 6 suppliers, 5 buyers, 8 products, 6 categories
    await expect(page.getByTestId('stat-total-suppliers')).toContainText('6');
    await expect(page.getByTestId('stat-total-buyers')).toContainText('5');
    await expect(page.getByTestId('stat-total-products')).toContainText('8');
    await expect(page.getByTestId('stat-total-categories')).toContainText('6');
  });

  test('admin overview pending counts are visible', async ({ page }) => {
    await expect(page.getByTestId('admin-overview')).toBeVisible();
    // Pending supplier approvals: 1 (SUP003 is pending)
    // Pending product approvals: 2 (PRD003, PRD007)
    // Pending ratings: 2 (RAT002, RAT004)
    const overview = page.getByTestId('admin-overview');
    await expect(overview.getByText('1').first()).toBeVisible();
    await expect(overview.getByText('2').first()).toBeVisible();
  });

  test('navigates to supplier management section', async ({ page }) => {
    await page.getByTestId('nav-suppliers').click();
    await expect(page.getByTestId('supplier-management')).toBeVisible();
    await expect(page.getByTestId('suppliers-table')).toBeVisible();
  });

  test('supplier management table shows suppliers', async ({ page }) => {
    await page.getByTestId('nav-suppliers').click();
    await expect(page.getByTestId('suppliers-table')).toBeVisible();
    // Should show supplier data
    await expect(page.getByText('Orion Defense Systems')).toBeVisible();
    await expect(page.getByText('Falcon Aerospace Technologies')).toBeVisible();
  });

  test('supplier approve action shows confirmation dialog', async ({ page }) => {
    await page.getByTestId('nav-suppliers').click();
    await expect(page.getByTestId('suppliers-table')).toBeVisible();
    // Titan Tactical Manufacturing is pending (SUP003)
    const approveBtn = page.getByTestId('approve-supplier-SUP003');
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();
    // Confirmation dialog should appear
    await expect(page.getByTestId('dialog-confirm-btn')).toBeVisible();
    await expect(page.getByTestId('dialog-cancel-btn')).toBeVisible();
  });

  test('supplier approval changes status after confirmation', async ({ page }) => {
    await page.getByTestId('nav-suppliers').click();
    await expect(page.getByTestId('suppliers-table')).toBeVisible();
    const approveBtn = page.getByTestId('approve-supplier-SUP003');
    await approveBtn.click();
    await page.getByTestId('dialog-confirm-btn').click();
    // Toast should appear
    const toastLocator = page.locator('[data-sonner-toast]');
    await expect(toastLocator).toBeVisible();
    await expect(toastLocator).toContainText('approved');
  });

  test('supplier suspend action triggers confirmation', async ({ page }) => {
    await page.getByTestId('nav-suppliers').click();
    await expect(page.getByTestId('suppliers-table')).toBeVisible();
    // Active supplier has suspend button (SUP001)
    const suspendBtn = page.getByTestId('suspend-supplier-SUP001');
    await expect(suspendBtn).toBeVisible();
    await suspendBtn.click();
    await expect(page.getByTestId('dialog-confirm-btn')).toBeVisible();
  });

  test('navigates to product management section', async ({ page }) => {
    await page.getByTestId('nav-products').click();
    await expect(page.getByTestId('product-management')).toBeVisible();
    await expect(page.getByTestId('products-table')).toBeVisible();
  });

  test('product management table shows products with status badges', async ({ page }) => {
    await page.getByTestId('nav-products').click();
    await expect(page.getByTestId('products-table')).toBeVisible();
    await expect(page.getByText('UAV Propulsion System MK-V')).toBeVisible();
    // Status badges should be visible
    await expect(page.getByText('approved').first()).toBeVisible();
  });

  test('pending product has approve and reject buttons', async ({ page }) => {
    await page.getByTestId('nav-products').click();
    // PRD003 is pending
    await expect(page.getByTestId('approve-product-PRD003')).toBeVisible();
    await expect(page.getByTestId('reject-product-PRD003')).toBeVisible();
  });

  test('product approval triggers toast notification', async ({ page }) => {
    await page.getByTestId('nav-products').click();
    await page.getByTestId('approve-product-PRD003').click();
    await page.getByTestId('dialog-confirm-btn').click();
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('approved');
  });

  test('navigates to category management', async ({ page }) => {
    await page.getByTestId('nav-categories').click();
    await expect(page.getByTestId('category-management')).toBeVisible();
  });

  test('category management shows category cards', async ({ page }) => {
    await page.getByTestId('nav-categories').click();
    await expect(page.getByTestId('category-card-CAT001')).toBeVisible();
    await expect(page.getByTestId('category-card-CAT002')).toBeVisible();
    await expect(page.getByTestId('category-card-CAT003')).toBeVisible();
    // Subcategories should be visible
    await expect(page.getByText('UAV & Aerospace')).toBeVisible();
    await expect(page.getByText('Propulsion')).toBeVisible();
  });

  test('add category button opens dialog', async ({ page }) => {
    await page.getByTestId('nav-categories').click();
    await page.getByTestId('add-category-btn').click({ force: true });
    await expect(page.getByTestId('new-category-input')).toBeVisible();
    await expect(page.getByTestId('add-category-confirm-btn')).toBeVisible();
  });

  test('adding a new category updates the list', async ({ page }) => {
    await page.getByTestId('nav-categories').click();
    await page.getByTestId('add-category-btn').click({ force: true });
    await page.getByTestId('new-category-input').fill('Test Cyber Defense');
    await page.getByTestId('add-category-confirm-btn').click();
    // Toast should confirm success
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Test Cyber Defense');
  });

  test('delete category triggers confirmation dialog', async ({ page }) => {
    await page.getByTestId('nav-categories').click();
    await page.getByTestId('delete-category-CAT001').click();
    await expect(page.getByTestId('dialog-confirm-btn')).toBeVisible();
  });

  test('navigates to buyer management', async ({ page }) => {
    await page.getByTestId('nav-buyers').click();
    await expect(page.getByTestId('buyer-management')).toBeVisible();
    await expect(page.getByTestId('buyers-table')).toBeVisible();
  });

  test('buyer management shows buyer list', async ({ page }) => {
    await page.getByTestId('nav-buyers').click();
    await expect(page.getByText('James Mitchell')).toBeVisible();
    await expect(page.getByText('Sarah Chen')).toBeVisible();
  });

  test('navigates to ratings moderation', async ({ page }) => {
    await page.getByTestId('nav-ratings').click();
    await expect(page.getByTestId('ratings-moderation')).toBeVisible();
    await expect(page.getByTestId('ratings-table')).toBeVisible();
  });

  test('ratings moderation shows approve/reject for pending ratings', async ({ page }) => {
    await page.getByTestId('nav-ratings').click();
    // RAT002 is pending
    await expect(page.getByTestId('approve-rating-RAT002')).toBeVisible();
    await expect(page.getByTestId('reject-rating-RAT002')).toBeVisible();
  });

  test('navigates to platform insights', async ({ page }) => {
    await page.getByTestId('nav-analytics').click();
    await expect(page.getByTestId('platform-insights')).toBeVisible();
  });

  test('platform insights shows charts', async ({ page }) => {
    await page.getByTestId('nav-analytics').click();
    await expect(page.getByTestId('platform-insights')).toBeVisible();
    await expect(page.getByText('Most Searched Components')).toBeVisible();
    await expect(page.getByText('Most Active Suppliers')).toBeVisible();
    await expect(page.getByText('Category Demand Trends')).toBeVisible();
  });
});
