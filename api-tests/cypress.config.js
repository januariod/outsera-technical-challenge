/**
 * api-tests/cypress.config.js
 * Configuração Cypress dedicada para testes de API.
 * Separada do E2E para permitir execução independente e tuning específico.
 */

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  // ── Identificação do projeto ─────────────────────────────────────────────
  projectId: 'api-tests',

  // ── Contexto de execução: sem browser ───────────────────────────────────
  // Testes de API rodam no contexto Node via cy.request(), sem abrir browser
  e2e: {
    // Pasta raiz dos specs
    specPattern: 'cypress/e2e/**/*.cy.js',

    // Suporte global
    supportFile: 'cypress/support/e2e.js',

    // Fixtures
    fixturesFolder: 'cypress/fixtures',

    // Artefatos
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    // URL base da API
    baseUrl: 'https://restful-booker.herokuapp.com',

    // Configurações de rede
    responseTimeout: 30000,
    requestTimeout: 30000,
    defaultCommandTimeout: 10000,

    // Vídeo apenas em CI para economizar recursos locais
    video: false,

    // Captura screenshot só em falha
    screenshotOnRunFailure: true,

    // Número de tentativas em caso de falha (flakiness mitigation)
    retries: {
      runMode: 2,  // CI
      openMode: 0, // Local interativo
    },

    // Variáveis de ambiente disponíveis nos testes
    env: {
      API_BASE_URL: 'https://restful-booker.herokuapp.com',
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD: 'password123',
    },

    setupNodeEvents(on, config) {
      // Tarefa para log de resultados de teste
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(data) {
          console.table(data)
          return null
        },
      })

      // Carrega variáveis de ambiente do processo (sobrepõe valores padrão)
      if (process.env.API_BASE_URL) {
        config.baseUrl = process.env.API_BASE_URL
      }
      if (process.env.ADMIN_USERNAME) {
        config.env.ADMIN_USERNAME = process.env.ADMIN_USERNAME
      }
      if (process.env.ADMIN_PASSWORD) {
        config.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
      }

      return config
    },
  },
})
