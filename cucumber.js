const common = {
  paths: ['features/**/*.feature'],
  require: ['src/step-definitions/**/*.ts', 'src/support/**/*.ts'],
  requireModule: ['ts-node/register'],
 "default": {
    "require": ["tests/steps/**/*.ts"],
    "requireModule": ["ts-node/register"],
    "format": [
      "@cucumber/pretty-formatter",
      "node_modules/allure-cucumberjs"
    ],
    "publishQuiet": true
  }
};

module.exports = {
  default: common,
  ci: {
    ...common,
    format: [
      'progress',
      'json:reports/cucumber-report.json',
      ['allure-cucumberjs', {
        resultsDir: './allure-results'
      }]
    ],
    parallel: 2
  }
}; 