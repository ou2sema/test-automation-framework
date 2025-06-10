import { Page } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { Logger } from '../utils/logger';

export class BasePage {
  //protected page: Page;
  protected logger: Logger;
  protected world: CustomWorld;
  protected url: string;
  
  constructor(world: CustomWorld, url: string = '') {
    this.world = world;
    this.url = url;
    this.logger = new Logger(this.constructor.name);
  }
  protected async getPage(): Promise<Page> {
    return this.world.getPage();
  }

  /**
   * Navigate to the page URL
   */
  async navigate(path: string = ''): Promise<void> {
    const page = await this.getPage(); // Use safe getter
    const fullUrl = `${this.world.environment.baseUrl}${this.url}${path}`;
    this.logger.info(`Navigating to: ${fullUrl}`);
    await page.goto(fullUrl);
  }
  
  /**
   * Wait for page to be loaded
   */
  async waitForPageLoad(): Promise<void> {
    const page = await this.getPage(); // Use safe getter
    await page.waitForLoadState('networkidle');
  }
  
  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    const page = await this.getPage(); // Use safe getter
    return await page.title();
  }
  
  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    const page = await this.getPage(); // Use safe getter
    const element = await page.$(selector);
    return element !== null;
  }
  
  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout?: number): Promise<void> {
    const page = await this.getPage(); // Use safe getter
    await page.waitForSelector(selector, {
      state: 'visible', 
      timeout: timeout || this.world.environment.timeouts.element
    });
  }
  
  /**
   * Click on element
   */
  async click(selector: string): Promise<void> {
    const page = await this.getPage(); // Use safe getter
    this.logger.debug(`Clicking element: ${selector}`);
    await this.waitForElement(selector);
    await page.click(selector);
  }
  
  /**
   * Type text into field
   */
  async typeText(selector: string, text: string): Promise<void> {
    const page = await this.getPage(); // Use safe getter
    this.logger.debug(`Typing into element: ${selector}`);
    await this.waitForElement(selector);
    await page.fill(selector, text);
  }
  
  /**
   * Get text content of element
   */
  async getText(selector: string): Promise<string> {
    const page = await this.getPage(); // Use safe getter
    await this.waitForElement(selector);
    return (await page.textContent(selector))?.trim() || '';
  }
  
  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    const page = await this.getPage(); // Use safe getter
    const screenshotPath = `reports/screenshots/${name}_${Date.now()}.png`;
    this.logger.info(`Taking screenshot: ${screenshotPath}`);
    return await page.screenshot({ path: screenshotPath, fullPage: true });
  }
}