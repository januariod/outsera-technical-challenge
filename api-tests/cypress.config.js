const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    baseUrl: 'https://restful-booker.herokuapp.com',
    responseTimeout: 30000,
    requestTimeout: 30000,
    defaultCommandTimeout: 10000,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
      return config
    },
  },
})
