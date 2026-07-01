const { defineConfig } = require('cypress')
const { resolveEnvironment, DEFAULT_ENV } = require('./cypress/config/environments')
const { validateRequiredEnv } = require('../scripts/validate-required-env')

module.exports = defineConfig({
  reporter: '../node_modules/mochawesome',
  reporterOptions: {
    reportDir: '../reports/api',
    overwrite: false,
    html: false,
    json: true
  },
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
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
      validateRequiredEnv(['ADMIN_USERNAME', 'ADMIN_PASSWORD'], config.env, {
        label: 'os testes de API (autenticação na Restful Booker)',
        hint: 'Crie api-tests/cypress.env.json (veja README.md) ou exporte CYPRESS_ADMIN_USERNAME/CYPRESS_ADMIN_PASSWORD.',
      })

      const environment = resolveEnvironment(config.env.ENV || process.env.CYPRESS_ENV || DEFAULT_ENV)
      config.baseUrl = environment.baseUrl
      config.env.ENV = environment.name

      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })

      console.log(`\nAmbiente de API: ${environment.name} → ${environment.baseUrl}\n`)
      return config
    },
  },
})
