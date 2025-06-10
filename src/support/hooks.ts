import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import fs from 'fs-extra';
import path from 'path';
import { Logger } from '../utils/logger';
import { generatePdfReport } from '../reporters/pdf-report-generator';

const logger = new Logger('Hooks');
const scenarioStatuses: any[] = [];
// Setup test directories and clean old files
BeforeAll(async function () {



  
  logger.info('Setting up test directories and cleaning previous files');

  const reportDirs = ['screenshots', 'videos', 'logs','pdf'];
  for (const dir of reportDirs) {
    const dirPath = path.join('reports', dir);
    await fs.ensureDir(dirPath); // Ensure the directory exists

    if (dir !== 'logs' && await fs.pathExists(dirPath)) {
      const files = await fs.readdir(dirPath);
      for (const file of files) {
        await fs.remove(path.join(dirPath, file));
      }
    }
  }
});

// Before each scenario
Before(async function (this: CustomWorld, { pickle }) {
  this.scenarioStartTime = Date.now();
  this.logger.info(`Starting scenario: ${pickle.name}`);
});

// After each scenario
After(async function (
  this: CustomWorld,
  { result, pickle }: { result?: { status: typeof Status[keyof typeof Status] }, pickle: any }
) {
  const scenarioName = pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
const duration = Date.now() - this.scenarioStartTime!;
  const status = result?.status || Status.PENDING;
  let screenshot: Buffer | null = null;
  let error = '';
  if (this.page) {
    if (result?.status === Status.FAILED) {
      this.logger.error(`Scenario failed: ${pickle.name}`);

      const screenshot = await this.page.screenshot({
        path: `reports/screenshots/${scenarioName}_failed.png`,
        fullPage: true,
      });

      this.attach(screenshot, 'image/png');
    } else {
      this.logger.info(`Scenario passed: ${pickle.name}`);
    }
  }
scenarioStatuses.push({
    name: scenarioName,
    status,
    duration,
    error,
    screenshot
  });
  await this.closeBrowser();
});


// After all tests
AfterAll(async function () {
  logger.info('All tests completed');
   try {
    await generatePdfReport((global as any).worldInstance, scenarioStatuses);
  } catch (e) {
     if (e instanceof Error) {
      logger.error(`Failed to generate PDF report: ${e.message}`);
    } else {
      logger.error(`Failed to generate PDF report: ${JSON.stringify(e)}`);
    }
  }
});
