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
    format: ['allure-cucumberjs/reporter'],
    formatOptions: {
      resultsDir: 'reports/allure-results',
      environmentInfo: {
        os_platform: require('os').platform(),
        os_version: require('os').release(),
        node_version: process.version
      }
      },
      require: ['src/support/hooks.ts', 'src/step-definitions/**/*.ts'],
    parallel: 2
  }
}; 