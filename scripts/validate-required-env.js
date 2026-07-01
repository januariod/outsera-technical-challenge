/**
 * Valida se as variáveis de ambiente obrigatórias estão definidas antes de
 * iniciar a execução dos testes. Usado por api-tests, e2e-tests e mobile-tests
 * para falhar rápido (fail-fast) com uma mensagem clara, em vez de deixar o
 * teste quebrar mais tarde com um erro genérico (ex.: "Bad credentials").
 *
 * @param {string[]} requiredVars Nomes das variáveis obrigatórias.
 * @param {Record<string, unknown>} envSource Objeto onde as variáveis devem existir
 *   (ex.: `config.env` do Cypress ou `process.env` no WebdriverIO).
 * @param {{ label?: string, hint?: string }} [options]
 * @throws {Error} Se alguma variável obrigatória estiver ausente/vazia.
 */
function validateRequiredEnv(requiredVars, envSource, options = {}) {
  const missing = requiredVars.filter((key) => {
    const value = envSource[key]
    return value === undefined || value === null || value === ''
  })

  if (missing.length === 0) return

  const label = options.label || 'esta suíte de testes'
  const lines = [
    '',
    '✘ Testes não serão executados: variáveis de ambiente obrigatórias ausentes.',
    `  Faltando: ${missing.join(', ')}`,
    `  Necessárias para: ${label}`,
    '  Configure-as seguindo a seção "Configuração de Ambiente" do README.md',
    options.hint ? `  ${options.hint}` : null,
    '',
  ].filter((line) => line !== null)

  throw new Error(lines.join('\n'))
}

module.exports = { validateRequiredEnv }
