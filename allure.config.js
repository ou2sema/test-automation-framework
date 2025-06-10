module.exports = {
  resultsDir: './allure-results',
  reportDir: './allure-report',
  properties: {
    'allure.results.directory': './allure-results',
    'allure.link.issue.pattern': 'https://github.com/your-org/your-repo/issues/{}',
    'allure.link.tms.pattern': 'https://your-tms.com/testcase/{}',
    'allure.link.custom.pattern': 'https://your-custom-link.com/{}'
  },
  categories: [
    {
      name: 'Ignored tests', 
      matchedStatuses: ['skipped']
    },
    {
      name: 'Infrastructure problems',
      matchedStatuses: ['broken', 'failed'],
      messageRegex: '.*bye-bye.*'
    },
    {
      name: 'Outdated tests',
      matchedStatuses: ['broken'],
      traceRegex: '.*FileNotFoundException.*'
    },
    {
      name: 'Product defects',
      matchedStatuses: ['failed']
    },
    {
      name: 'Test defects',
      matchedStatuses: ['broken']
    }
  ],
  environment: {
    'Test Environment': process.env.TEST_ENV || 'staging',
    'Browser': process.env.BROWSER || 'chromium',
    'Platform': process.platform,
    'Node Version': process.version,
    'Base URL': process.env.BASE_URL || 'https://example.com'
  }
};