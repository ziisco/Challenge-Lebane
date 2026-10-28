import { randomNumericId } from '../../../support/commands';

class AddProjectPage {
  elements = {
    projectNameInput: () => cy.get('[data-cy="new-renderer-field-nombreProyecto"]'),
    currencyInput: () => cy.get('[data-cy="new-renderer-field-moneda"]'),
    countryInput: () => cy.get('[data-cy="new-renderer-field-pais"]'),
    stateInput: () => cy.get('[data-cy="new-renderer-field-estado"]'),
    cityInput: () => cy.get('[data-cy="new-renderer-field-ciudad"]'),
    jurisdictionInput: () => cy.get('[data-cy="new-renderer-field-jurisdiccionId"]'),
    addressInput: () => cy.get('[data-cy="new-renderer-field-calle"]'),
    streetNumberInput: () => cy.get('[data-cy="new-renderer-field-numeroPuerta"]'),
    startDateInput: () => cy.get('[data-cy="new-renderer-field-fechaInicio"]'),
    endDateInput: () => cy.get('[data-cy="new-renderer-field-fechaFin"]'),
    constructionTypeInput: () => cy.get('[data-cy="new-renderer-field-tipoConstruccion"]'),
    adjustmentModeInput: () => cy.get('[data-cy="new-renderer-field-modalidadAjuste"]'),
    razonSocialInput: () => cy.get('[name="razonSocial"] input'),
    razonSocialNameInput: () => cy.get('[data-cy="new-renderer-field-nombreRazonSocial"]'),
    documentTypeInput: () => cy.get('[data-cy="new-renderer-field-documentoDeIdentidadTipo"]'),
    documentNumberInput: () => cy.get('[data-cy="new-renderer-field-documentoDeIdentidadNumero"]'),
    registerButton: () => cy.contains('button[type="submit"]', 'Registrar')
  };

  assertFormIsVisible() {
    this.elements.projectNameInput().should('be.visible');
    return this;
  }

  selectAutocomplete(getInput, option) {
    getInput().click().clear().type(option);
    cy.get('.MuiAutocomplete-popper')
      .should('be.visible')
      .contains('li', option, { matchCase: false })
      .click();
    return this;
  }

  fillEndDate() {
    cy.get('button[aria-label^="Elige la fecha"]').eq(1).click();

    cy.get('.MuiPickersPopper-root')
      .should('be.visible')
      .find('button[aria-label="Próximo mes"]')
      .click();

    cy.get('.MuiPickersPopper-root')
      .find('button.MuiPickersDay-root:not(.Mui-disabled)')
      .first()
      .click();

    this.elements.endDateInput().invoke('val').should('match', /^\d{2}\/\d{2}\/\d{4}$/);
    return this;
  }

  clickRegister() {
    this.elements.registerButton().should('be.enabled').click();
    cy.url({ timeout: 30000 }).should('include', '/proyecto/');
    return this;
  }

  assertProjectCreated() {
    cy.url().should('include', '/proyecto/');
    cy.get('@projectName').then((projectName) => {
      const uniqueSuffix = projectName.split(' ').pop();
      cy.contains(uniqueSuffix, { timeout: 20000 }).should('be.visible');
    });
    return this;
  }

  fillRequiredFields() {
    cy.fixture('projectData').then((data) => {
      const projectName = `${data.projectNamePrefix} ${Date.now()}`;
      cy.wrap(projectName).as('projectName');

      this.elements.projectNameInput().clear().type(projectName);
      this.elements.addressInput().clear().type(data.address);
      this.elements.streetNumberInput().clear().type(data.streetNumber);
      this.fillEndDate();

      [
        [this.elements.currencyInput, data.currency],
        [this.elements.countryInput, data.country],
        [this.elements.stateInput, data.state],
        [this.elements.cityInput, data.city],
        [this.elements.jurisdictionInput, data.jurisdiction],
        [this.elements.constructionTypeInput, data.constructionType],
        [this.elements.adjustmentModeInput, data.adjustmentMode]
      ].forEach(([getInput, option]) => this.selectAutocomplete(getInput, option));

      this.selectAutocomplete(this.elements.razonSocialInput, projectName);
      this.elements.razonSocialNameInput().should('be.visible');
      this.elements.documentTypeInput().should('be.enabled');
      this.selectAutocomplete(this.elements.documentTypeInput, data.documentType);
      this.elements.documentNumberInput().should('be.enabled').clear().type(randomNumericId(7));
    });

    return this;
  }

  assertRequiredFieldsAreCompleted() {
    cy.fixture('projectData').then((data) => {
      cy.get('@projectName').then((projectName) => {
        this.elements.projectNameInput().should('have.value', projectName);
        this.elements.addressInput().should('have.value', data.address);
        this.elements.streetNumberInput().should('have.value', data.streetNumber);
        this.elements.currencyInput().should('contain.value', data.currency);
        this.elements.countryInput().should('have.value', data.country);
        this.elements.stateInput().should('have.value', data.state);
        this.elements.cityInput().should('have.value', data.city);
        this.elements.constructionTypeInput().should('have.value', data.constructionType);
        this.elements.adjustmentModeInput().should('have.value', data.adjustmentMode);
        this.elements.razonSocialInput().should('contain.value', projectName);
        this.elements.documentTypeInput().should('have.value', data.documentType);
        this.elements.documentNumberInput().invoke('val').should('match', /^\d{1,7}$/);
        this.elements.endDateInput().invoke('val').should('match', /^\d{2}\/\d{2}\/\d{4}$/);
      });
    });

    return this;
  }
}

export default new AddProjectPage();
