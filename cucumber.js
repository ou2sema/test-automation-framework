const common = {
  paths: ['features/**/*.feature'],
  require: ['src/step-definitions/**/*.ts', 'src/support/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: [
    'progress-bar',
    'json:reports/cucumber-report.json'
  ],
  formatOptions: { snippetInterface: 'async-await' },
  worldParameters: {
    browserType: process.env.BROWSER || 'chromium',
    headless: false
  }
};

module.exports = {
  default: {
    ...common,
    publishQuiet: true
  },
  ci: {
    ...common,
    format: ['progress', 'json:reports/cucumber-report.json'],
    parallel: 2
  }
};