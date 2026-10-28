import loginPage from '../pages/loginPage';
import dashboardPage from '../pages/dashboard/dashboardPage';
import addProjectPage from '../pages/dashboard/addProject/addProjectPage';
import clientesMenu from '../pages/dashboard/clientes/clientesMenu';
import unidadesPage from '../pages/dashboard/clientes/unidadesPage';
import grillaUnidadesPage from '../pages/dashboard/clientes/grillaUnidadesPage';

describe('Lista de precios de unidades - carga manual', { testIsolation: false }, () => {
  after(() => {
    loginPage.clearSession();
  });

  it('Muestra el formulario de ingreso', () => {
    loginPage.visit();
    loginPage.assertLoginPageIsVisible();
  });

  it('Ingresa correctamente con credenciales válidas', () => {
    loginPage.loginWithValidCredentials();
    loginPage.assertSuccessfulLogin();
  });

  it('Abre el formulario de nuevo proyecto', () => {
    dashboardPage.clickAddProject();
    addProjectPage.assertFormIsVisible();
  });

  it('Completa y registra el proyecto', () => {
    addProjectPage.fillRequiredFields();
    addProjectPage.assertRequiredFieldsAreCompleted();
    addProjectPage.clickRegister();
    addProjectPage.assertProjectCreated();
  });

  it('Abre Unidades desde el menú Clientes', () => {
    dashboardPage.clickClientes();
    clientesMenu.clickUnidades();
    unidadesPage.assertFormIsVisible();
  });

  it('Completa y guarda las áreas para generar unidades', () => {
    unidadesPage.fillRequiredFields();
    unidadesPage.clickSave();
    grillaUnidadesPage.assertIsVisible();
    grillaUnidadesPage.assertUnitsWereCreated();
  });

  it('Modifica el precio de una unidad y actualiza la lista', () => {
    grillaUnidadesPage.updateUnitPrice();
  });

  it('Elimina una unidad y mantiene la lista de precios', () => {
    grillaUnidadesPage.deleteUnit();
    grillaUnidadesPage.assertUnitDeletedAndListRemains();
  });

  it('Elimina la última unidad y borra la lista automáticamente', () => {
    grillaUnidadesPage.deleteUntilLastUnit();
    grillaUnidadesPage.deleteLastUnit();
    grillaUnidadesPage.assertPriceListDeleted();
  });

  it('Elimina las unidades que quedan sin lista de precios', () => {
    grillaUnidadesPage.assertNoUnitsLeft();
  });
});

describe('Lista de precios de unidades - carga por template', { testIsolation: false }, () => {
  after(() => {
    loginPage.clearSession();
  });

  it('Muestra el formulario de ingreso', () => {
    loginPage.visit();
    loginPage.assertLoginPageIsVisible();
  });

  it('Ingresa correctamente con credenciales válidas', () => {
    loginPage.loginWithValidCredentials();
    loginPage.assertSuccessfulLogin();
  });

  it('Abre el formulario de nuevo proyecto', () => {
    dashboardPage.clickAddProject();
    addProjectPage.assertFormIsVisible();
  });

  it('Completa y registra el proyecto', () => {
    addProjectPage.fillRequiredFields();
    addProjectPage.assertRequiredFieldsAreCompleted();
    addProjectPage.clickRegister();
    addProjectPage.assertProjectCreated();
  });

  it('Abre Unidades desde el menú Clientes', () => {
    dashboardPage.clickClientes();
    clientesMenu.clickUnidades();
    unidadesPage.assertFormIsVisible();
  });

  it('Guarda las áreas para acceder a la grilla', () => {
    unidadesPage.fillRequiredFields();
    unidadesPage.clickSave();
    grillaUnidadesPage.assertIsVisible();
  });

  it('Carga unidades desde el template y las muestra en la grilla', () => {
    grillaUnidadesPage.uploadTemplate();
    grillaUnidadesPage.assertTemplateUnitsAreVisible();
  });

  it('Modifica el precio de una unidad y actualiza la lista', () => {
    grillaUnidadesPage.updateUnitPrice();
  });
});
