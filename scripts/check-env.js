/**
 * scripts/check-env.js
 * Verifica variáveis de ambiente obrigatórias antes de executar os testes.
 * Garante que a suíte não seja executada sem configuração adequada.
 */

const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

// Carrega .env se existir
const envPath = path.resolve(__dirname, '../.env')
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath })
}

const REQUIRED_VARS = [
  'API_BASE_URL',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
]

const missing = REQUIRED_VARS.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.warn(
    chalk.yellow(`\n⚠  Variáveis de ambiente não encontradas: ${missing.join(', ')}`),
  )
  console.warn(chalk.yellow('   Usando valores padrão do cypress.env.json.\n'))
} else {
  console.log(chalk.green('✓  Variáveis de ambiente verificadas com sucesso.\n'))
}
