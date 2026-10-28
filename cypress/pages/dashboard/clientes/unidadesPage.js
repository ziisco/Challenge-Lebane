class UnidadesPage {
  elements = {
    title: () => cy.contains('Actualizar datos del proyecto'),
    precioListaInput: () => cy.get('[name="precioListaMetroCuadrado"]'),
    rendimientoInput: () => cy.get('[name="gananciaEsperada"]'),
    pisosInput: () => cy.get('[name="pisos"]'),
    subsuelosInput: () => cy.get('[name="subsuelos"]'),
    tipologiasInput: () => cy.get('[data-cy="new-renderer-field-tipologias"]'),
    unidadesPorPisoInput: () => cy.get('[name="unidadesPorPiso"]'),
    cocherasInput: () => cy.get('[name="cantidadCocheras"]'),
    streetViewInput: () => cy.get('[data-cy="new-renderer-field-streetView"]'),
    googleMapsInput: () => cy.get('[data-cy="new-renderer-field-googleMaps"]'),
    listaPreciosInput: () => cy.get('[data-cy="new-renderer-field-versionListaPrecios"]'),
    saveButton: () => cy.contains('button[type="submit"]', 'Guardar')
  };

  assertFormIsVisible() {
    this.elements.title().should('be.visible');
    this.elements.precioListaInput().should('be.visible');
    return this;
  }

  selectRandomTipologia() {
    this.elements.tipologiasInput().click();
    cy.get('.MuiAutocomplete-popper [role="option"]')
      .should('have.length.at.least', 1)
      .then(($options) => {
        const index = Cypress._.random(0, $options.length - 1);
        cy.wrap($options.eq(index).text().trim()).as('tipologia');
        cy.wrap($options.eq(index)).click();
      });
    cy.get('body').type('{esc}');
    return this;
  }

  fillRequiredFields() {
    cy.fixture('unidadesData').then((data) => {
      this.elements.precioListaInput().clear().type(data.precioListaM2);
      this.elements.pisosInput().clear().type(data.cantidadPisos);
      this.elements.subsuelosInput().clear().type(data.cantidadSubsuelos);
      this.elements.unidadesPorPisoInput().clear().type(data.unidadesPorPiso);
      this.selectRandomTipologia();

      [
        this.elements.rendimientoInput,
        this.elements.cocherasInput,
        this.elements.streetViewInput,
        this.elements.googleMapsInput,
        this.elements.listaPreciosInput
      ].forEach((getInput) => getInput().clear().type(data.valorPorDefecto));
    });

    return this;
  }

  clickSave() {
    this.elements.saveButton().should('be.enabled').click();
    cy.contains('button', 'Editar', { timeout: 30000 }).should('be.visible');
    cy.fixture('unidadesData').then((data) => {
      cy.contains(data.precioListaM2).should('be.visible');
    });
    return this;
  }
}

export default new UnidadesPage();
