/**
 * scripts/generate-reports.js
 *
 * Gera UM relatório HTML por escopo de teste, mantendo os resultados
 * de cada ponto do desafio claramente separados:
 *
 *   reports/api/index.html  → Ponto 1: Testes Automatizados de API (Cypress)
 *   reports/e2e/index.html  → Ponto 2: Testes End-to-End (Cypress + Cucumber)
 *
 * Os escopos Mobile (reports/mobile) e Performance (reports/performance)
 * geram seus próprios artefatos nativos (WDIO spec / K6 summary) e não
 * passam por este merge — cada um permanece isolado em sua pasta.
 *
 * Decisão técnica: relatórios separados por escopo evitam ambiguidade.
 * Cada arquivo deixa explícito qual ponto do PDF está sendo apresentado.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const REPORTS_DIR = path.resolve(__dirname, '../reports')

// Escopos que produzem JSON Mochawesome e devem virar HTML
const SCOPES = [
  { dir: 'api', title: 'Ponto 1 - Testes de API (Cypress)' },
  { dir: 'e2e', title: 'Ponto 2 - Testes E2E (Cypress + Cucumber)' },
]

function generateScopeReport({ dir, title }) {
  const scopeDir = path.join(REPORTS_DIR, dir)

  if (!fs.existsSync(scopeDir)) {
    console.warn(chalk.yellow(`⚠  ${dir}: pasta inexistente, pulando.`))
    return false
  }

  const jsonFiles = fs
    .readdirSync(scopeDir)
    .filter((f) => f.endsWith('.json') && f !== `${dir}-merged.json`)

  if (jsonFiles.length === 0) {
    console.warn(chalk.yellow(`⚠  ${dir}: nenhum JSON encontrado. Rode os testes primeiro.`))
    return false
  }

  const mergedJson = path.join(scopeDir, `${dir}-merged.json`)

  // 1) Mescla todos os JSON do escopo
  execSync(`npx mochawesome-merge "${scopeDir}/*.json" -o "${mergedJson}"`, {
    stdio: 'inherit',
  })

  // 2) Gera HTML isolado para o escopo
  execSync(
    `npx marge "${mergedJson}" -o "${scopeDir}" -f index ` +
      `--reportTitle "${title}" --reportPageTitle "Outsera QA - ${dir.toUpperCase()}"`,
    { stdio: 'inherit' },
  )

  console.log(chalk.green(`✓  ${dir}: ${path.join(scopeDir, 'index.html')}`))
  return true
}

console.log(chalk.cyan('\n📊 Gerando relatórios por escopo...\n'))

let generated = 0
SCOPES.forEach((scope) => {
  if (generateScopeReport(scope)) generated += 1
})

if (generated === 0) {
  console.warn(chalk.yellow('\n⚠  Nenhum relatório gerado.\n'))
  process.exit(0)
}

console.log(chalk.cyan(`\n✓  ${generated} relatório(s) gerado(s). Cada escopo está isolado em sua pasta.\n`))
