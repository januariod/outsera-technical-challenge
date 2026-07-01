const environments = {
  local: {
    baseUrl: 'http://localhost:3001',
  },
  dev: {
    baseUrl: 'https://restful-booker.herokuapp.com',
  },
  staging: {
    baseUrl: 'https://restful-booker.herokuapp.com',
  },
  production: {
    baseUrl: 'https://restful-booker.herokuapp.com',
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
