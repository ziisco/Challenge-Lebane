# propiedadesLebane.cy.js

E2E del flujo de **listas de precios de unidades** en Lebane (`https://tst.lebane.app`). El spec tiene dos `describe` independientes. En ambos `testIsolation` está en `false`: cada `it` sigue al anterior sobre el mismo proyecto. Al terminar, el `after()` limpia cookies y storage.

Las acciones viven en Page Objects (`loginPage`, `dashboardPage`, `addProjectPage`, `clientesMenu`, `unidadesPage`, `grillaUnidadesPage`). Este archivo solo orquesta pasos.

## 1. Carga manual

Arma un proyecto desde cero, genera unidades con el formulario de áreas y prueba la lista de precios.

| Paso | Qué hace |
| --- | --- |
| Formulario de ingreso | Abre `/sign-in` y verifica el login. |
| Login | Entra con usuario y password de `cypress.env.json` (`cy.env()`), sin “Recordarme”. |
| Nuevo proyecto | Click en “Agregar proyecto”. |
| Registrar proyecto | Completa el formulario requerido (`projectData.json`): nombre `QA Automation` + sufijo único, ARS, Argentina, CABA, Av. Acoyte 520, edificio, ajuste definitivo, razón social = nombre, CI Capital Federal y un documento de 7 dígitos. Confirma que la URL queda en `/proyecto/`. |
| Clientes → Unidades | Abre el menú lateral y el formulario *Actualizar datos del proyecto*. |
| Generar unidades | Precio lista m² 70, 7 pisos, 1 subsuelo, 2 unidades por piso, tipología al azar, resto en 0 (`unidadesData.json`). Guarda y valida la grilla (piso 7, unidades `101` y `702`). |
| Editar precio | Scroll a *Precio Unidad*, abre el editor de la primera fila y lo cambia (0 → 3000). |
| Eliminar una unidad | Tacho + *Confirmar*. La unidad desaparece y la lista `0` sigue. |
| Eliminar la última | Borra el resto hasta una y confirma la última. Lebane elimina la lista sola. |
| Sin lista | La grilla no deja unidades huérfanas. |

## 2. Carga por template

Mismo camino hasta la grilla (otro proyecto). En vez de validar las unidades generadas por el formulario, sube un Excel.

| Paso | Qué hace |
| --- | --- |
| Setup | Login, proyecto, Clientes → Unidades y Guardar, igual que el describe manual. |
| Cargar template | *Templates* → *Cargar Template de Unidades* → `templateUnidades.xlsx` → *Cargar*. Descarga el reporte de validación y cierra el modal. La grilla pasa a *Lista precios* del día. |
| Validar grilla | Contrasta piso, orientación, tipologías y estados con `templateUnidades.json` (6 unidades: entregado, disponible, reservado, vendido, bloqueado, alquilado). |
| Editar precio | Misma edición en grilla: 2500 → 3000 o 1000 → 1500 según el valor actual. |
