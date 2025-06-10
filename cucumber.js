const common = {
  paths: ['features/**/*.feature'],
  require: ['src/step-definitions/**/*.ts', 'src/support/**/*.ts'],
  requireModule: ['ts-node/register'],
  format: [
    'progress-bar',
    'json:reports/cucumber-report.json',
    'allure-cucumberjs' ,
    "node_modules/allure-cucumberjs" // add this for Allure
  ],
  parallel: 1,
  formatOptions: { snippetInterface: 'async-await' },
  worldParameters: {
    browserType: process.env.BROWSER || 'chromium',
    headless: false
  },
  publishQuiet: true,
    paths: ["features/**/*.feature"],
    parallel: 1,
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
     format: [
      'progress', 
      'json:reports/cucumber-report.json',
      'allure-cucumberjs' // Add this for CI too if needed
    ],
    //format: ['progress', 'json:reports/cucumber-report.json'],
    parallel: 2
  }
};