import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;
  readonly logoutButton: Locator;

  // Multiple selector strategies for self-healing
  private readonly selectors = {
    username: ['#username', 'input[name="username"]', 'input[type="text"]'],
    password: ['#password', 'input[name="password"]', 'input[type="password"]'],
    loginBtn: ['button[type="submit"]', '.radius', 'button'],
    flash: ['#flash', '.flash', '.alert'],
    logout: ['a[href="/logout"]', '.button.secondary']
  };

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(this.selectors.username.join(','));
    this.passwordInput = page.locator(this.selectors.password.join(','));
    this.loginButton = page.locator(this.selectors.loginBtn.join(','));
    this.flashMessage = page.locator(this.selectors.flash.join(','));
    this.logoutButton = page.locator(this.selectors.logout.join(','));
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getFlashMessage(): Promise<string> {
    await this.flashMessage.waitFor({ state: 'visible' });
    return (await this.flashMessage.textContent()) || '';
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.logoutButton.isVisible().catch(() => false);
  }

  async logout() {
    if (await this.isLoggedIn()) {
      await this.logoutButton.click();
    }
  }
}