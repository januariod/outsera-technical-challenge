/**
 * e2e-tests/cypress.config.js
 * Configuração Cypress para testes E2E com Cucumber (Gherkin).
 * Utiliza @badeball/cypress-cucumber-preprocessor com esbuild para bundling.
 */

const { defineConfig } = require('cypress')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
const {
  addCucumberPreprocessorPlugin,
} = require('@badeball/cypress-cucumber-preprocessor')
const {
  createEsbuildPlugin,
} = require('@badeball/cypress-cucumber-preprocessor/esbuild')

module.exports = defineConfig({
  projectId: 'e2e-tests',

  e2e: {
    specPattern: 'cypress/e2e/features/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    baseUrl: 'https://restful-booker.herokuapp.com',

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

    env: {
      E2E_BASE_URL: 'https://restful-booker.herokuapp.com',
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD: 'password123',
    },

    async setupNodeEvents(on, config) {
      // Registra o plugin Cucumber ANTES de configurar o bundler
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

      // Variáveis de ambiente do processo sobrepõem valores padrão
      if (process.env.E2E_BASE_URL) {
        config.baseUrl = process.env.E2E_BASE_URL
      }

      // IMPORTANTE: retornar config é obrigatório com Cucumber preprocessor
      return config
    },
  },
})
