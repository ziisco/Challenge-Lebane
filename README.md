# Challenge Lebane — QA Automation

Suite E2E en Cypress (v16) para [Lebane](https://tst.lebane.app). Cubre el flujo de listas de precios de unidades: alta de proyecto, carga manual de áreas, carga por template, edición de precio y reglas de eliminación.

## Requisitos

- Node.js 18 o superior
- npm
- Acceso al ambiente de test y credenciales de Lebane

## Instalación

```bash
git clone https://github.com/ziisco/Challenge-Lebane.git
cd Challenge-Lebane
npm install
```

Las credenciales viven en `cypress/cypress.env.json` (no hardcodeadas en los specs):

```json
{
  "url": "https://tst.lebane.app",
  "username": "tu-usuario",
  "password": "tu-password"
}
```

`cypress.config.js` toma `baseUrl` y las variables de entorno desde ese archivo.

## Cómo correr los tests

Modo interactivo (Cypress UI):

```bash
npm run cy:open
```

Headless (toda la suite):

```bash
npm test
```

o

```bash
npm run cy:run
```

Un spec puntual:

```bash
npx cypress run --spec cypress/e2e/propiedadesLebane.cy.js
```

Al terminar se genera `cypress/reports/Reporte de ejecución Lebane.html`. Videos y screenshots quedan en `cypress/videos/` y `cypress/screenshots/` (ignorados por git).

## Estructura

```
cypress/
  e2e/
    propiedadesLebane.cy.js      # Spec: solo describe / it
  pages/
    loginPage.js
    dashboard/
      dashboardPage.js
      addProject/
        addProjectPage.js
      clientes/
        clientesMenu.js
        unidadesPage.js
        grillaUnidadesPage.js
  fixtures/
    projectData.json
    unidadesData.json
    templateUnidades.json
    templateUnidades.xlsx
  support/
    commands.js                  # Fechas e IDs random
    e2e.js
  cypress.env.json
cypress.config.js
```

Hay **dos describes** en el spec:

1. **Carga manual** — login → proyecto → Clientes / Unidades → generar grilla → editar precio → eliminar una unidad (la lista sigue) → eliminar la última (la lista se borra) → no quedan unidades huérfanas.
2. **Carga por template** — el mismo setup hasta la grilla, sube `templateUnidades.xlsx` y valida las unidades; después edita un precio.

## Decisiones de diseño

**Page Object Model por carpetas.** El spec no conoce selectores: solo orquesta pages. `dashboard` es el padre; `addProject` y `clientes` son hijos; `unidadesPage` y `grillaUnidadesPage` cuelgan de clientes. Así el menú y el formulario no se mezclan con la grilla.

**Specs limpios.** Cada `it` es un paso del journey. Los helpers (`fillRequiredFields`, `deleteUnit`, `updateUnitPrice`) viven en las pages.

**`testIsolation: false`.** Los aliases y el proyecto creado no sobreviven entre `it` si Cypress limpia la sesión. El flujo es secuencial a propósito. Cada describe limpia cookies y storage en el `after()` para que el login siguiente no herede una sesión abierta.

**Datos fuera del spec.** Credenciales en `cypress.env.json` y, en Cypress 16, se leen con `cy.env()` (no `Cypress.env()`). Datos de negocio en fixtures. El nombre del proyecto es `QA Automation` + sufijo único para no chocar con corridas anteriores.

**Selectores.** Se prioriza `data-cy` / `data-testid` cuando existe. Si no, `name`, `aria-label` o texto visible (`contains`). En la grilla, las celdas se ubican por `data-column-id` (`numero`, `precio`).

**Edición de precio.** La columna *Precio Unidad* queda fuera del viewport. El test hace scroll horizontal en `.MuiTableContainer-root` y clickea el `.cursor-text` de la fila (no el header), con `scrollBehavior: false` para que Cypress no vuelva a meter la celda debajo del título sticky.

**Borrado de unidades.** El tacho abre el diálogo *Eliminar unidad* → *Confirmar*. Borrar una unidad deja la lista `0`. Borrar la última elimina la lista; las unidades sin lista no quedan en la grilla.

**Template.** Se carga el `.xlsx` tal cual con `cy.selectFile`, sin convertirlo. Después del reporte de carga, la grilla muestra *Lista precios* del día.

## Qué más testearía (y por qué)

El PDF pide cubrir como mínimo los 7 escenarios. Estos no están automatizados; los priorizaría después:

- **Login inválido y sesión vencida.** Es la puerta de toda la app; un error acá tumba el resto de la suite.
- **Alta de proyecto incompleta.** Registrar sin razón social, domicilio o documento. El formulario es largo y el happy path no pesca esos requeridos.
- **Template con filas inválidas.** Precio vacío, tipología inexistente o unidad repetida. El de ahora solo cubre “datos correctos”; hay que afirmar que el reporte marca el error y que la grilla no incorpora esa fila.
- **Estados de unidad.** Reservar / vender / bloquear y que no se pueda vender dos veces ni borrar una vendida. Es el negocio de Lebane, no solo el precio.
- **Dos listas de precios.** Crear una segunda lista, cambiar entre ellas y editar un precio sin pisar la otra. Hoy el flujo vive en una sola lista.
- **Smoke de Espacios comunes, Inversores y Tesorería.** Abrir, crear un registro mínimo y verlo. Evita que el suite quede ciego fuera de Clientes.
