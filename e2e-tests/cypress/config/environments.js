const environments = {
  local: {
    baseUrl: 'http://localhost:8080',
  },
  dev: {
    baseUrl: 'https://www.saucedemo.com',
  },
  staging: {
    baseUrl: 'https://www.saucedemo.com',
  },
  production: {
    baseUrl: 'https://www.saucedemo.com',
  },
}

const DEFAULT_ENV = 'dev'

function resolveEnvironment(envName) {
  const selected = envName || DEFAULT_ENV
  const config = environments[selected]

  if (!config) {
    const available = Object.keys(environments).join(', ')
    throw new Error(
      `Ambiente inválido: "${selected}". Ambientes disponíveis: ${available}.`,
    )
  }

  return { name: selected, ...config }
}

module.exports = { environments, resolveEnvironment, DEFAULT_ENV }
