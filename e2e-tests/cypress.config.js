const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const {
  addCucumberPreprocessorPlugin,
} = require('@badeball/cypress-cucumber-preprocessor')
const {
  createEsbuildPlugin,
} = require('@badeball/cypress-cucumber-preprocessor/esbuild')
const { resolveEnvironment, DEFAULT_ENV } = require('./cypress/config/environments')
const { validateRequiredEnv } = require('../scripts/validate-required-env')

module.exports = defineConfig({
  reporter: '../node_modules/mochawesome',
  reporterOptions: {
    reportDir: '../reports/e2e',
    overwrite: false,
    html: false,
    json: true
  },
  e2e: {
    specPattern: 'cypress/e2e/features/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    viewportWidth: 1280,
    viewportHeight: 720,
    responseTimeout: 30000,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    experimentalRunAllSpecs: true,
    async setupNodeEvents(on, config) {
      validateRequiredEnv(['SAUCE_USERNAME', 'SAUCE_PASSWORD'], config.env, {
        label: 'os testes E2E (login no SauceDemo)',
        hint: 'Crie e2e-tests/cypress.env.json (veja README.md) ou exporte CYPRESS_SAUCE_USERNAME/CYPRESS_SAUCE_PASSWORD.',
      })

      const environment = resolveEnvironment(config.env.ENV || process.env.CYPRESS_ENV || DEFAULT_ENV)
      config.baseUrl = environment.baseUrl
      config.env.ENV = environment.name

      await addCucumberPreprocessorPlugin(on, config)

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      )

      on('task', {
        log(message) {
          console.log(message)
          return null
        },
      })

      console.log(`\nAmbiente E2E: ${environment.name} → ${environment.baseUrl}\n`)
      return config
    },
  },
})
