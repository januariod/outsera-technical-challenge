const path = require('path')

exports.config = {
  runner: 'local',
  port: 4723,

  specs: [
    '../specs/**/*.js'
  ],

  autoCompileOpts: {
    autoCompile: false
  },

  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Small_Phone-5554',
    'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '9.0',
    'appium:orientation': 'PORTRAIT',
    'appium:automationName': 'UiAutomator2',
    'appium:app': path.join(process.cwd(), 'mobile-tests/app/Android-MyDemoAppRN.apk'),
    'appium:appWaitActivity': 'com.saucelabs.mydemoapp.rn.MainActivity',
    'appium:newCommandTimeout': 240,
  }],
  logLevel: 'error',
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'mocha',
  reporters: [
    'spec',
    ['mochawesome', {
      outputDir: 'reports/mobile',
      outputFileFormat: function () {
        return 'results.json'
      }
    }]
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },
}
