import { test, expect } from '@playwright/test';

test.describe('API Health Checks', () => {
  const baseURL = process.env.BASE_URL || 'https://the-internet.herokuapp.com';

  test('GET /login - should return 200', async ({ request }) => {
    const response = await request.get(`${baseURL}/login`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/html');
  });

  test('POST /authenticate - should validate credentials', async ({ request }) => {
    const response = await request.post(`${baseURL}/authenticate`, {
      data: {
        username: 'tomsmith',
        password: 'SuperSecretPassword!'
      }
    });
    
    // Note: This endpoint might redirect, we're testing the flow
    expect(response.status()).toBe(200);
  });

  test('GET /upload - should be accessible after login', async ({ request }) => {
    const response = await request.get(`${baseURL}/upload`);
    expect(response.status()).toBe(200);
  });

  test('API response time should be under 2 seconds', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get(`${baseURL}/login`);
    const endTime = Date.now();
    
    expect(response.status()).toBe(200);
    expect(endTime - startTime).toBeLessThan(2000);
  });
});