const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const REPORTS_DIR = path.resolve(__dirname, '../reports')

const SCOPES = [
  { dir: 'api', title: 'Ponto 1 - Testes de API (Cypress)' },
  { dir: 'e2e', title: 'Ponto 2 - Testes E2E (Cypress + Cucumber)' },
  { dir: 'mobile', title: 'Ponto 3 - Testes Mobile (Appium + WDIO)' }
]

function generateScopeReport({ dir, title }) {
  const scopeDir = path.join(REPORTS_DIR, dir)

  if (!fs.existsSync(scopeDir)) {
    console.log(chalk.yellow(`⚠  ${dir}: pasta inexistente, pulando.`))
    return false
  }

  const jsonFiles = fs
    .readdirSync(scopeDir)
    .filter((f) => f.endsWith('.json') && f !== `${dir}-merged.json`)

  if (jsonFiles.length === 0) {
    console.log(chalk.yellow(`⚠  ${dir}: nenhum JSON encontrado. Rode os testes primeiro (ex.: npm run test:${dir}).`))
    return false
  }

  const mergedJson = path.join(scopeDir, `${dir}-merged.json`)

  const npxBin = process.platform === 'win32' ? 'npx.cmd' : 'npx'

  execFileSync(
    npxBin,
    ['mochawesome-merge', path.join(scopeDir, '*.json'), '-o', mergedJson],
    { stdio: 'inherit' },
  )

  execFileSync(
    npxBin,
    [
      'marge',
      mergedJson,
      '-o', scopeDir,
      '-f', 'index',
      '--inline',
      '--reportTitle', title,
      '--reportPageTitle', `Outsera QA - ${dir.toUpperCase()}`,
    ],
    { stdio: 'inherit' },
  )

  fs.readdirSync(scopeDir).forEach(file => {
    if (file.endsWith('.json')) {
      fs.unlinkSync(path.join(scopeDir, file))
    }
  })

  console.log(chalk.green(`✓  ${dir}: ${path.join(scopeDir, 'index.html')}`))
  return true
}

console.log(chalk.cyan('\n📊 Gerando relatórios por escopo...\n'))

const requestedScope = process.argv[2]
const scopesToRun = requestedScope
  ? SCOPES.filter((s) => s.dir === requestedScope)
  : SCOPES

if (requestedScope && scopesToRun.length === 0) {
  console.error(
    chalk.red(`✘ Escopo inválido: "${requestedScope}". Use um de: ${SCOPES.map((s) => s.dir).join(', ')}`),
  )
  process.exit(1)
}

let generated = 0
scopesToRun.forEach((scope) => {
  if (generateScopeReport(scope)) generated += 1
})

if (generated === 0) {
  console.warn(chalk.yellow('\n⚠  Nenhum relatório gerado.\n'))
  process.exit(0)
}

console.log(chalk.cyan(`\n✓  ${generated} relatório(s) gerado(s). Pastas limpas apenas com HTML!\n`))
