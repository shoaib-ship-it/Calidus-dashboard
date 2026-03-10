import { test, expect } from '@playwright/test';
import { switchRole, dismissToasts } from '../fixtures/helpers';

const BASE_URL = 'https://dashboard-roles-ui.preview.emergentagent.com';

test.describe('Supplier Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await dismissToasts(page);
    await switchRole(page, 'supplier');
  });

  test('supplier overview shows stats', async ({ page }) => {
    await expect(page.getByTestId('supplier-overview')).toBeVisible();
    await expect(page.getByTestId('stat-profile-views')).toBeVisible();
    await expect(page.getByTestId('stat-total-enquiries')).toBeVisible();
    await expect(page.getByTestId('stat-active-products')).toBeVisible();
    await expect(page.getByTestId('stat-average-rating')).toBeVisible();
  });

  test('supplier overview stat values match mock data', async ({ page }) => {
    // Numbers are formatted with locale commas: 2847 -> 2,847
    await expect(page.getByTestId('stat-profile-views')).toContainText('2,847');
    await expect(page.getByTestId('stat-total-enquiries')).toContainText('156');
    // averageRating is 4.8
    await expect(page.getByTestId('stat-average-rating')).toContainText('4.8');
  });

  test('supplier sidebar nav has correct items', async ({ page }) => {
    await expect(page.getByTestId('nav-overview')).toBeVisible();
    await expect(page.getByTestId('nav-profile')).toBeVisible();
    await expect(page.getByTestId('nav-products')).toBeVisible();
    await expect(page.getByTestId('nav-enquiries')).toBeVisible();
    await expect(page.getByTestId('nav-ratings')).toBeVisible();
    // Admin-only items should NOT be visible
    await expect(page.getByTestId('nav-suppliers')).not.toBeVisible();
    await expect(page.getByTestId('nav-buyers')).not.toBeVisible();
    await expect(page.getByTestId('nav-analytics')).not.toBeVisible();
  });

  test('navigates to supplier product management', async ({ page }) => {
    await page.getByTestId('nav-products').click();
    // Supplier product management heading is shown
    await expect(page.getByRole('heading', { name: 'Product Management' })).toBeVisible();
  });

  test('supplier product management shows add product button', async ({ page }) => {
    await page.getByTestId('nav-products').click();
    // Add product button should be visible
    await expect(page.getByRole('button', { name: /add product/i })).toBeVisible();
  });

  test('add product dialog opens', async ({ page }) => {
    await page.getByTestId('nav-products').click();
    await page.getByRole('button', { name: /add product/i }).click({ force: true });
    await expect(page.getByTestId('add-product-name')).toBeVisible();
    await expect(page.getByTestId('add-product-category')).toBeVisible();
    await expect(page.getByTestId('add-product-description')).toBeVisible();
    await expect(page.getByTestId('add-product-submit-btn')).toBeVisible();
  });

  test('add product shows success toast', async ({ page }) => {
    await page.getByTestId('nav-products').click();
    await page.getByRole('button', { name: /add product/i }).click({ force: true });
    await page.getByTestId('add-product-name').fill('New Test Product');
    await page.getByTestId('add-product-submit-btn').click();
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('added');
  });

  test('navigates to enquiries section', async ({ page }) => {
    await page.getByTestId('nav-enquiries').click();
    await expect(page.getByRole('heading', { name: 'Enquiries' })).toBeVisible();
  });

  test('supplier enquiries shows enquiry data', async ({ page }) => {
    await page.getByTestId('nav-enquiries').click();
    // Orion Defense has enquiries ENQ001 and ENQ005
    await expect(page.getByText('UAV Propulsion System MK-V')).toBeVisible();
  });

  test('supplier enquiries has reply action', async ({ page }) => {
    await page.getByTestId('nav-enquiries').click();
    // Reply button for enquiries should be visible
    const replyBtn = page.locator('[data-testid^="reply-enquiry-"]').first();
    await expect(replyBtn).toBeVisible();
  });

  test('reply dialog opens for enquiry', async ({ page }) => {
    await page.getByTestId('nav-enquiries').click();
    const replyBtn = page.locator('[data-testid^="reply-enquiry-"]').first();
    await replyBtn.click();
    await expect(page.getByTestId('enquiry-reply-textarea')).toBeVisible();
    await expect(page.getByTestId('send-reply-btn')).toBeVisible();
  });

  test('sends reply and shows toast', async ({ page }) => {
    await page.getByTestId('nav-enquiries').click();
    const replyBtn = page.locator('[data-testid^="reply-enquiry-"]').first();
    await replyBtn.click();
    await page.getByTestId('enquiry-reply-textarea').fill('Thank you for your enquiry...');
    await page.getByTestId('send-reply-btn').click();
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Reply sent');
  });

  test('navigates to supplier ratings section', async ({ page }) => {
    await page.getByTestId('nav-ratings').click();
    await expect(page.getByRole('heading', { name: 'Ratings & Reviews' })).toBeVisible();
  });
});

test.describe('Buyer Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await dismissToasts(page);
    await switchRole(page, 'buyer');
  });

  test('buyer overview shows stat cards', async ({ page }) => {
    await expect(page.getByTestId('buyer-overview')).toBeVisible();
    await expect(page.getByTestId('stat-total-enquiries')).toBeVisible();
    await expect(page.getByTestId('stat-suppliers-contacted')).toBeVisible();
    await expect(page.getByTestId('stat-pending-responses')).toBeVisible();
    await expect(page.getByTestId('stat-ratings-submitted')).toBeVisible();
  });

  test('buyer overview stat values match mock data', async ({ page }) => {
    // James Mitchell (BUY001) has only ENQ001 - totalEnquiries=1, pendingResponses=0
    // buyerStats uses allEnquiries filtered by buyerId
    await expect(page.getByTestId('stat-total-enquiries')).toContainText('1');
    // ENQ001 is 'replied' so pending responses = 0
    await expect(page.getByTestId('stat-pending-responses')).toContainText('0');
  });

  test('buyer sidebar shows correct nav items', async ({ page }) => {
    await expect(page.getByTestId('nav-overview')).toBeVisible();
    await expect(page.getByTestId('nav-enquiries')).toBeVisible();
    await expect(page.getByTestId('nav-ratings')).toBeVisible();
    await expect(page.getByTestId('nav-profile')).toBeVisible();
    // Supplier and Admin-only items should NOT be visible
    await expect(page.getByTestId('nav-suppliers')).not.toBeVisible();
    await expect(page.getByTestId('nav-analytics')).not.toBeVisible();
  });

  test('navigates to buyer enquiries section', async ({ page }) => {
    await page.getByTestId('nav-enquiries').click();
    await expect(page.getByTestId('buyer-enquiries')).toBeVisible();
    await expect(page.getByTestId('buyer-enquiries-table')).toBeVisible();
  });

  test('buyer enquiries shows James Mitchell enquiries', async ({ page }) => {
    await page.getByTestId('nav-enquiries').click();
    // ENQ001 - UAV Propulsion System MK-V
    await expect(page.getByText('UAV Propulsion System MK-V')).toBeVisible();
  });

  test('new enquiry button opens dialog', async ({ page }) => {
    await page.getByTestId('nav-enquiries').click();
    await page.getByTestId('new-enquiry-btn').click({ force: true });
    await expect(page.getByTestId('enquiry-product-search')).toBeVisible();
    await expect(page.getByTestId('enquiry-message')).toBeVisible();
    await expect(page.getByTestId('send-enquiry-btn')).toBeVisible();
  });

  test('send enquiry shows success toast', async ({ page }) => {
    await page.getByTestId('nav-enquiries').click();
    await page.getByTestId('new-enquiry-btn').click({ force: true });
    await page.getByTestId('enquiry-message').fill('Interested in your product');
    await page.getByTestId('send-enquiry-btn').click();
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Enquiry sent');
  });

  test('navigates to buyer ratings section', async ({ page }) => {
    await page.getByTestId('nav-ratings').click();
    await expect(page.getByTestId('buyer-ratings')).toBeVisible();
  });

  test('buyer ratings shows submitted ratings', async ({ page }) => {
    await page.getByTestId('nav-ratings').click();
    // James Mitchell has 2 ratings: RAT001 and RAT005
    await expect(page.getByTestId('rating-card-RAT001')).toBeVisible();
    await expect(page.getByTestId('rating-card-RAT005')).toBeVisible();
  });

  test('submit rating button opens rating dialog', async ({ page }) => {
    await page.getByTestId('nav-ratings').click();
    await page.getByTestId('add-rating-btn').click({ force: true });
    // Rating dialog opens
    await expect(page.getByTestId('rating-star-1')).toBeVisible();
    await expect(page.getByTestId('rating-star-5')).toBeVisible();
    await expect(page.getByTestId('rating-review-textarea')).toBeVisible();
    await expect(page.getByTestId('submit-rating-btn')).toBeVisible();
  });

  test('submitting a rating adds it to the list', async ({ page }) => {
    await page.getByTestId('nav-ratings').click();
    await page.getByTestId('add-rating-btn').click({ force: true });
    await page.getByTestId('rating-star-4').click();
    await page.getByTestId('rating-review-textarea').fill('Great product for our operations.');
    await page.getByTestId('submit-rating-btn').click();
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('submitted');
  });

  test('navigates to buyer profile section', async ({ page }) => {
    await page.getByTestId('nav-profile').click();
    await expect(page.getByTestId('buyer-profile')).toBeVisible();
  });

  test('buyer profile shows correct user data', async ({ page }) => {
    await page.getByTestId('nav-profile').click();
    await expect(page.getByTestId('buyer-name-input')).toHaveValue('James Mitchell');
    await expect(page.getByTestId('buyer-company-input')).toHaveValue('US Army Procurement Division');
    await expect(page.getByTestId('buyer-email-input')).toHaveValue('j.mitchell@army.mil');
  });

  test('edit profile button toggles edit mode', async ({ page }) => {
    await page.getByTestId('nav-profile').click();
    const editBtn = page.getByTestId('edit-buyer-profile-btn');
    await expect(editBtn).toContainText('Edit Profile');
    await editBtn.click();
    await expect(editBtn).toContainText('Save Changes');
  });

  test('save profile shows success toast', async ({ page }) => {
    await page.getByTestId('nav-profile').click();
    await page.getByTestId('edit-buyer-profile-btn').click();
    // Now in edit mode - click save
    await page.getByTestId('edit-buyer-profile-btn').click();
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Profile updated');
  });
});
