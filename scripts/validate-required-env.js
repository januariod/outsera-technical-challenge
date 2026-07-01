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
