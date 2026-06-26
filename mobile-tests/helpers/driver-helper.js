/**
 * mobile-tests/helpers/driver-helper.js
 * Utilitários para gerenciamento do driver Appium/WebDriverIO.
 */

/**
 * Retorna informações do dispositivo conectado.
 */
async function getDeviceInfo() {
  const capabilities = browser.capabilities
  return {
    platform: capabilities.platformName,
    deviceName: capabilities['appium:deviceName'],
    version: capabilities['appium:platformVersion'],
    automationName: capabilities['appium:automationName'],
  }
}

/**
 * Verifica se está rodando em Android.
 */
function isAndroid() {
  return browser.isAndroid
}

/**
 * Verifica se está rodando em iOS.
 */
function isIOS() {
  return browser.isIOS
}

/**
 * Alterna para o contexto nativo (NATIVE_APP).
 */
async function switchToNativeContext() {
  await browser.switchContext('NATIVE_APP')
}

/**
 * Alterna para o contexto WebView disponível.
 */
async function switchToWebViewContext() {
  await browser.pause(2000) // Aguarda WebView carregar
  const contexts = await browser.getContexts()
  const webviewContext = contexts.find((ctx) => ctx.includes('WEBVIEW'))

  if (!webviewContext) {
    throw new Error('Nenhum contexto WebView encontrado. Verifique se a app está carregada.')
  }

  await browser.switchContext(webviewContext)
}

/**
 * Rola a tela para um elemento específico.
 * @param {string} selector
 */
async function scrollToElement(selector) {
  const element = await $(selector)
  await browser.execute('arguments[0].scrollIntoView(true)', element)
}

/**
 * Aguarda rede idle (útil após navegação em WebView).
 * @param {number} timeout
 */
async function waitForNetworkIdle(timeout = 5000) {
  await browser.pause(timeout)
}

module.exports = {
  getDeviceInfo,
  isAndroid,
  isIOS,
  switchToNativeContext,
  switchToWebViewContext,
  scrollToElement,
  waitForNetworkIdle,
}
