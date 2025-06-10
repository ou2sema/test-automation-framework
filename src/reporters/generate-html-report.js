import reporter from 'cucumber-html-reporter';
import fs from 'fs-extra';
import path from 'path';

// Options for the HTML reporter
const options = {
  theme: 'bootstrap',
  jsonFile: 'reports/cucumber-report.json',
  output: 'reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: true,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': process.env.TEST_ENV || 'dev',
    'Browser': process.env.BROWSER || 'chromium',
    'Platform': process.platform,
    'Parallel': process.env.PARALLEL || 'false',
    'Executed': new Date().toISOString()
  }
};

// Ensure the report directory exists
fs.ensureDirSync(path.dirname(options.output));

// Copy screenshots to attach to report if they exist
fs.copySync('reports/screenshots', 'reports/html/screenshots', {
  overwrite: true,
  filter: (src) => fs.existsSync(src)
});

// Generate the report
try {
  reporter.generate(options);
  console.log(`HTML report generated at: ${options.output}`);
} catch (err) {
  console.error('Error generating report:', err);
}