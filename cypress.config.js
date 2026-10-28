const { defineConfig } = require('cypress');
const env = require('./cypress/cypress.env.json');

module.exports = defineConfig({
  e2e: {
    baseUrl: env.url,
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    env: {
      username: env.username,
      password: env.password
    },
    setupNodeEvents(on, config) {
      return config;
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: true,
      html: true,
      json: false,
      reportFilename: 'Reporte de ejecución Lebane',
      reportTitle: 'Reporte de ejecución Lebane',
      reportPageTitle: 'Reporte de ejecución Lebane',
      inline: true
    }
  }
});