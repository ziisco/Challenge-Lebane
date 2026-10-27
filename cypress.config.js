const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    // Configuración del reporte Mochawesome
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/mocha', // Carpeta donde se guardarán los resultados
      overwrite: false,                   // Evita sobrescribir reportes previos al correr specs individuales
      html: false,                        // Se desactiva el HTML individual para generarlo unificado al final
      json: true                          // Genera archivos JSON por cada archivo de prueba
    }
  }
});