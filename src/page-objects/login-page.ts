import { BasePage } from './base-page';
import { CustomWorld } from '../support/world';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  // UI Selectors
  private selectors = {
    usernameInput: "input[data-qa='login-email']",
    passwordInput: "input[data-qa='login-password']",
    loginButton: "button[data-qa='login-button']",
    errorMessage: "p[style*='color: red']",
  };

  constructor(world: CustomWorld) {
    super(world, 'login');
  }
protected async getPage(): Promise<Page> {
    return this.world.getPage();
  }
  /**
   * Login with the specified credentials
   */
  async login(username: string, password: string): Promise<void> {
    const page = await this.getPage(); // Use safe getter
    this.logger.info(`Logging in with username: ${username}`);
    await this.navigate();
    await this.typeText(this.selectors.usernameInput, username);
    await this.typeText(this.selectors.passwordInput, password);
    await this.click(this.selectors.loginButton);
    
    // Wait for navigation after login
    await page.waitForNavigation({ 
      waitUntil: 'networkidle',
      timeout: this.world.environment.timeouts.pageLoad 
    });
  }

  /**
   * Login with the current user from the world
   */
  async loginWithCurrentUser(): Promise<void> {
    if (!this.world.currentUser) {
      throw new Error('No current user set in the world');
    }
    
    await this.login(
      this.world.currentUser.username,
      this.world.currentUser.password
    );
  }

  /**
   * Check if login error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.elementExists(this.selectors.errorMessage);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isErrorMessageDisplayed()) {
      return await this.getText(this.selectors.errorMessage);
    }
    return '';
  }
}