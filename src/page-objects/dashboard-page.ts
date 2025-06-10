import { BasePage } from './base-page';
import { CustomWorld } from '../support/world';
import { Page } from '@playwright/test';

export class DashboardPage extends BasePage {
  // UI Selectors
  private selectors = {
     userWelcome: "a:has(i.fa-user)", // Targets the user profile link
    logoutButton: "a[href='/logout']",
    navigationMenu: '.shop-menu.pull-right',
    menuItems: '.nav.navbar-nav > li',
    userProfile: ".user-profile, i.fa.fa-user",
  };

  constructor(world: CustomWorld) {
    super(world, '');
  }
  protected async getPage(): Promise<Page> {
      return this.world.getPage();
    }

  /**
   * Check if user is logged in by verifying welcome message
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.elementExists(this.selectors.userWelcome);
  }

  /**
   * Get the welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getText(this.selectors.userWelcome);
  }

  /**
   * Click on a specific menu item in the navigation
   */
  async navigateToMenuItem(menuName: string): Promise<void> {
    // Navigate to a specific menu item by text content
    await this.click(`${this.selectors.navigationMenu} a:has-text("${menuName}")`);
    await this.waitForPageLoad();
  }
  
  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    const page = await this.getPage(); // Use safe getter
    this.logger.info('Logging out current user');
    await this.click(this.selectors.logoutButton);
    
    // Wait for navigation after logout
    await page.waitForNavigation({ 
      waitUntil: 'networkidle',
      timeout: this.world.environment.timeouts.pageLoad 
    });
  }

  /**
   * Perform search using the search box
   */

  /**
   * Check notifications
   */
}