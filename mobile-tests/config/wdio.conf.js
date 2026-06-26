/**
 * mobile-tests/config/wdio.conf.js
 * Configuração WebDriverIO + Appium para testes mobile/webview.
 *
 * Decisão técnica: WebDriverIO v8 como test runner para Appium porque
 * oferece melhor integração com múltiplos drivers (Android/iOS), suporte
 * nativo a Appium services e report generators.
 *
 * Plataforma default: Android (emulador)
 * Para iOS: ajustar capabilities conforme comentários abaixo.
 */

const path = require('path')

// Resolve plataforma alvo via variável de ambiente (default: android)
const PLATFORM = (process.env.PLATFORM || 'android').toLowerCase()

// ── Capabilities por plataforma ──────────────────────────────────────────────

const androidCapabilities = {
  platformName: 'Android',
  'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'emulator-5554',
  'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '13.0',
  'appium:automationName': 'UiAutomator2',
  'appium:browserName': 'Chrome',
  'appium:chromedriverAutodownload': true,
  'appium:newCommandTimeout': 60,
  'appium:noReset': false,
}

const iosCapabilities = {
  platformName: 'iOS',
  'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone 14',
  'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '17.0',
  'appium:automationName': 'XCUITest',
  'appium:browserName': 'Safari',
  'appium:newCommandTimeout': 60,
  'appium:noReset': false,
}

const capabilities = PLATFORM === 'ios' ? iosCapabilities : androidCapabilities

// ── Configuração WebDriverIO ─────────────────────────────────────────────────

exports.config = {
  // Appium server
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT || '4723'),
  path: '/',

  // Specs
  specs: [
    path.join(__dirname, '../tests/**/*.test.js'),
  ],

  // Capabilities
  capabilities: [capabilities],

  // Test framework
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000, // 2 minutos por teste (mobile é mais lento)
    retries: 1,
  },

  // Concorrência (mobile geralmente 1 device de cada vez)
  maxInstances: 1,

  // Reporters
  reporters: [
    'spec',
    ['junit', {
      outputDir: path.join(__dirname, '../../reports/mobile'),
      outputFileFormat: (options) => `mobile-results-${Date.now()}.xml`,
    }],
  ],

  // Log level
  logLevel: 'warn',

  // Appium service embutido (sobe o servidor automaticamente)
  services: [
    ['appium', {
      command: 'appium',
      args: {
        relaxedSecurity: true,
        log: path.join(__dirname, '../../reports/mobile/appium.log'),
      },
    }],
  ],

  // Hooks
  before() {
    // Aumenta timeout implícito para aguardar elementos mobile
    browser.setTimeout({ implicit: 10000 })
  },

  afterTest(test, context, { passed }) {
    if (!passed) {
      // Captura screenshot em falha
      browser.takeScreenshot()
    }
  },
}
