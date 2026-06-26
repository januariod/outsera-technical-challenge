/**
 * mobile-tests/runner.js
 * Script de entrada para execução dos testes mobile via npm run test:mobile.
 * Verifica disponibilidade do Appium antes de disparar o WebDriverIO.
 */

const { execSync } = require('child_process')
const path = require('path')
const chalk = require('chalk')

console.log(chalk.cyan('\n📱 Iniciando execução dos testes Mobile/Appium...\n'))

// Verifica se Appium está instalado
try {
  execSync('appium --version', { stdio: 'pipe' })
  console.log(chalk.green('✓ Appium encontrado'))
} catch {
  console.error(chalk.red('✗ Appium não encontrado. Instale com: npm install -g appium'))
  console.error(chalk.yellow('  Em seguida instale o driver: appium driver install uiautomator2'))
  process.exit(1)
}

// Executa os testes
try {
  execSync(
    `npx wdio run ${path.join(__dirname, 'config/wdio.conf.js')}`,
    { stdio: 'inherit' },
  )
  console.log(chalk.green('\n✓ Testes mobile concluídos com sucesso!\n'))
} catch (error) {
  console.error(chalk.red('\n✗ Testes mobile falharam!\n'))
  process.exit(error.status || 1)
}
