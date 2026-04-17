import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { UploadPage } from '../../pages/UploadPage';

test.describe('KYC Portal - Login and Document Upload', () => {
  let loginPage: LoginPage;
  let uploadPage: UploadPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    uploadPage = new UploadPage(page);
  });

  test('TC-001: Successful login with valid credentials', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_USERNAME || 'tomsmith',
      process.env.TEST_PASSWORD || 'SuperSecretPassword!'
    );
    
    const flashMessage = await loginPage.getFlashMessage();
    expect(flashMessage).toContain('You logged into a secure area');
    expect(await loginPage.isLoggedIn()).toBeTruthy();
  });

  test('TC-003: Upload KYC document after login', async ({ page }) => {
    // First login
    await loginPage.goto();
    await loginPage.login(
      process.env.TEST_USERNAME || 'tomsmith',
      process.env.TEST_PASSWORD || 'SuperSecretPassword!'
    );
    
    // Navigate to upload page
    await uploadPage.goto();
    
    // Upload file
    await uploadPage.uploadFile('sample.pdf');
    
    // Verify upload success
    const success = await uploadPage.isUploadSuccessful();
    expect(success).toBeTruthy();
    
    // Verify uploaded file name
    const uploadedFile = await uploadPage.getUploadedFileName();
    expect(uploadedFile).toContain('sample.pdf');
  });
});