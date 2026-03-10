import { test, expect } from '@playwright/test';
import { switchRole, dismissToasts } from '../fixtures/helpers';

const BASE_URL = 'https://dashboard-roles-ui.preview.emergentagent.com';

test.describe('Golden Path - Full User Journey', () => {
  test('Admin: full flow - view stats, approve supplier, approve product, add category', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await dismissToasts(page);

    // Step 1: Verify Admin overview loads with correct data
    await expect(page.getByTestId('admin-overview')).toBeVisible();
    await expect(page.getByTestId('stat-total-suppliers')).toContainText('6');

    // Step 2: Go to Supplier Management and approve pending supplier
    await page.getByTestId('nav-suppliers').click();
    await expect(page.getByTestId('suppliers-table')).toBeVisible();
    await page.getByTestId('approve-supplier-SUP003').click();
    await expect(page.getByTestId('dialog-confirm-btn')).toBeVisible();
    await page.getByTestId('dialog-confirm-btn').click();
    const approveToast = page.locator('[data-sonner-toast]');
    await expect(approveToast).toContainText('approved');

    // Step 3: Go to Product Management and approve pending product
    await page.getByTestId('nav-products').click();
    await expect(page.getByTestId('products-table')).toBeVisible();
    await page.getByTestId('approve-product-PRD003').click();
    await page.getByTestId('dialog-confirm-btn').click();
    const productToast = page.locator('[data-sonner-toast]');
    await expect(productToast).toContainText('approved');

    // Step 4: Go to Category Management and add a new category
    await page.getByTestId('nav-categories').click();
    await page.getByTestId('add-category-btn').click({ force: true });
    await page.getByTestId('new-category-input').fill('Cyber Defense Systems');
    await page.getByTestId('add-category-confirm-btn').click();
    const categoryToast = page.locator('[data-sonner-toast]');
    await expect(categoryToast).toContainText('Cyber Defense Systems');

    // Step 5: Navigate to Platform Insights and verify charts visible
    await page.getByTestId('nav-analytics').click();
    await expect(page.getByTestId('platform-insights')).toBeVisible();
    await expect(page.getByText('Most Searched Components')).toBeVisible();
  });

  test('Role switching journey - Admin -> Supplier -> Buyer -> Admin', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await dismissToasts(page);

    // Admin dashboard
    await expect(page.getByTestId('admin-overview')).toBeVisible();

    // Switch to Supplier
    await switchRole(page, 'supplier');
    await expect(page.getByTestId('supplier-overview')).toBeVisible();
    // Admin nav items gone
    await expect(page.getByTestId('nav-buyers')).not.toBeVisible();

    // Switch to Buyer
    await switchRole(page, 'buyer');
    await expect(page.getByTestId('buyer-overview')).toBeVisible();
    // Supplier nav items gone
    await expect(page.getByTestId('nav-buyers')).not.toBeVisible();

    // Switch back to Admin
    await switchRole(page, 'admin');
    await expect(page.getByTestId('admin-overview')).toBeVisible();
    // Admin-specific nav items restored
    await expect(page.getByTestId('nav-buyers')).toBeVisible();
    await expect(page.getByTestId('nav-analytics')).toBeVisible();
  });

  test('Supplier: full flow - view overview, manage products, reply to enquiry', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await dismissToasts(page);

    await switchRole(page, 'supplier');
    // Verify stats
    await expect(page.getByTestId('stat-profile-views')).toContainText('2,847');

    // Navigate to products
    await page.getByTestId('nav-products').click();
    await expect(page.getByRole('heading', { name: 'Product Management' })).toBeVisible();

    // Navigate to enquiries
    await page.getByTestId('nav-enquiries').click();
    await expect(page.getByText('UAV Propulsion System MK-V')).toBeVisible();
  });

  test('Buyer: full flow - view overview, send enquiry, submit rating', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await dismissToasts(page);

    await switchRole(page, 'buyer');
    await expect(page.getByTestId('buyer-overview')).toBeVisible();

    // Send a new enquiry
    await page.getByTestId('nav-enquiries').click();
    await page.getByTestId('new-enquiry-btn').click({ force: true });
    await page.getByTestId('enquiry-message').fill('Need more info about this product.');
    await page.getByTestId('send-enquiry-btn').click();
    const enquiryToast = page.locator('[data-sonner-toast]');
    await expect(enquiryToast).toContainText('Enquiry sent');

    // Submit a rating
    await page.getByTestId('nav-ratings').click();
    await page.getByTestId('add-rating-btn').click({ force: true });
    await page.getByTestId('rating-star-5').click();
    await page.getByTestId('rating-review-textarea').fill('Excellent quality product.');
    await page.getByTestId('submit-rating-btn').click();
    const ratingToast = page.locator('[data-sonner-toast]');
    await expect(ratingToast).toContainText('submitted');
  });
});
