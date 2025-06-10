import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import environmentConfig from '../config/environments';
import { Logger } from '../utils/logger';

export interface CustomWorld extends World {
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
  environment: typeof environmentConfig;
  logger: Logger;
  browserType: string;
  headless: boolean;
  currentUser: { username: string; password: string } | null;
   scenarioStartTime?: number;
  // Custom methods
  getPage(): Promise<Page>;
  closeBrowser(): Promise<void>;
}

export class PlaywrightWorld extends World implements CustomWorld {
  browser: Browser | null = null;
  context: BrowserContext | null = null;
  page: Page | null = null;
  environment = environmentConfig;
  logger: Logger;
  browserType: string;
  headless: boolean;
  currentUser: { username: string; password: string } | null = null;

  constructor(options: IWorldOptions) {
    super(options);
      (global as any).worldInstance = this;
    this.browserType = options.parameters.browserType || 'chromium';
    this.headless = options.parameters.headless !== false;
    this.logger = new Logger('PlaywrightWorld');
    this.logger.info(`Initializing world with browser: ${this.browserType}, headless: ${this.headless}`);
  }

  async getPage(): Promise<Page> {
    if (!this.browser) {
      this.logger.info(`Launching ${this.browserType} browser`);
      
      switch (this.browserType) {
        case 'firefox':
          this.browser = await firefox.launch({ headless: this.headless });
          break;
        case 'webkit':
          this.browser = await webkit.launch({ headless: this.headless });
          break;
        default:
          this.browser = await chromium.launch({ headless: this.headless });
      }

      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: 720 },
        recordVideo: { dir: 'reports/videos/' }
      });
      
      this.page = await this.context.newPage();
      
      // Setup timeouts
      this.page.setDefaultTimeout(this.environment.timeouts.default);
      this.page.setDefaultNavigationTimeout(this.environment.timeouts.pageLoad);
    }

    if (!this.page) {
      this.page = await this.context!.newPage();
    }

    return this.page;
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      this.logger.info('Closing browser');
      await this.context?.close();
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }
}

setWorldConstructor(PlaywrightWorld);