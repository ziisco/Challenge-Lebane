class GrillaUnidadesPage {
  elements = {
    unidadesTab: () => cy.contains('[role="tab"]', 'Unidades'),
    addUnitButton: () => cy.contains('Adicionar unidad', { timeout: 30000 }),
    templatesButton: () => cy.contains('button', 'Templates'),
    uploadTemplateOption: () => cy.contains('button', 'Cargar Template de Unidades'),
    fileInput: () => cy.get('#upload-template'),
    confirmUploadButton: () => cy.contains('button', /^Cargar$/),
    reportModal: () => cy.contains('Descarga de reporte de template', { timeout: 30000 }),
    downloadReportButton: () => cy.contains('button', 'Descargar reporte'),
    closeReportButton: () => cy.contains('button', 'Cerrar'),
    priceCells: () => cy.get('tbody td[data-column-id="precio"]'),
    unitNumberCells: () => cy.get('td[data-column-id="numero"]'),
    deleteButtons: () => cy.get('svg[aria-label="Eliminar"]').closest('button'),
    priceListButton: () => cy.get('span[aria-label="0"]').contains('button', /^0$/)
  };

  assertIsVisible() {
    this.elements.unidadesTab().should('be.visible').click();
    this.elements.addUnitButton().should('be.visible');
    return this;
  }

  assertUnitsWereCreated() {
    cy.fixture('unidadesData').then((data) => {
      cy.get('@tipologia').then((tipologia) => {
        cy.contains(tipologia, { timeout: 20000 }).should('be.visible');
      });

      cy.contains(`Piso ${data.cantidadPisos}`).should('be.visible');
      cy.contains('101').should('be.visible');
      cy.contains(`${data.cantidadPisos}02`).should('be.visible');
    });

    return this;
  }

  uploadTemplate() {
    this.elements.templatesButton().should('be.visible').click();
    this.elements.uploadTemplateOption().should('be.visible').click();
    this.elements.fileInput().selectFile('cypress/fixtures/templateUnidades.xlsx', { force: true });
    this.elements.confirmUploadButton().should('be.enabled').click();
    this.elements.reportModal().should('be.visible');
    this.elements.downloadReportButton().click();
    cy.get('body').then(($body) => {
      if ($body.text().includes('Descarga de reporte de template')) {
        this.elements.closeReportButton().click();
      }
    });
    cy.contains('Lista precios', { timeout: 20000 }).should('be.visible');
    return this;
  }

  assertTemplateUnitsAreVisible() {
    cy.fixture('templateUnidades').then((data) => {
      cy.contains('Piso 1', { timeout: 20000 }).should('be.visible');
      cy.contains(data.units[0].orientacion).should('be.visible');
      data.units.forEach((unit) => {
        cy.contains(unit.tipologia).should('be.visible');
        cy.contains(unit.estado).should('be.visible');
      });
    });

    return this;
  }

  updateUnitPrice() {
    this.elements.unitNumberCells()
      .filter((_, el) => el.innerText.trim())
      .first()
      .closest('tr')
      .find('td[data-column-id="precio"]')
      .then(($cell) => {
        const current = Number($cell.text().replace(/\./g, '').replace(',', '.'));
        const nextPrice = current === 1000 ? '1500' : '3000';

        cy.wrap(nextPrice).as('updatedPrice');
        cy.get('.MuiTableContainer-root').scrollTo('right');
        cy.wrap($cell).find('.cursor-text').click({ force: true, scrollBehavior: false });
      });

    cy.get('@updatedPrice').then((nextPrice) => {
      cy.get('input[placeholder="Valor..."]').should('be.visible').clear().type(`${nextPrice}{enter}`);

      const formatted = nextPrice === '1500' ? /1\.?500/ : /3\.?000/;
      this.elements.priceCells().should(($cells) => {
        expect($cells.text()).to.match(formatted);
      });
    });

    return this;
  }

  confirmDelete() {
    cy.get('[role="dialog"]', { timeout: 10000 }).should('be.visible');
    cy.contains('[role="dialog"] button', /^Confirmar$/).click();
    cy.get('[role="dialog"]').should('not.exist');
    return this;
  }

  deleteUnit() {
    this.elements.unitNumberCells().first().invoke('text').then((unit) => {
      cy.wrap(unit.trim()).as('deletedUnit');
    });
    this.elements.unitNumberCells().its('length').then((count) => {
      this.elements.deleteButtons().first().click({ force: true });
      this.confirmDelete();
      this.elements.unitNumberCells().should('have.length', count - 1);
    });
    return this;
  }

  assertUnitDeletedAndListRemains() {
    cy.get('@deletedUnit').then((unit) => {
      this.elements.unitNumberCells().should('not.contain', unit);
    });
    this.elements.unitNumberCells().should('have.length.at.least', 1);
    this.elements.priceListButton().should('be.visible');
    return this;
  }

  deleteUntilLastUnit() {
    this.elements.unitNumberCells().then(($cells) => {
      const extras = $cells.length - 1;

      Cypress._.times(extras, (index) => {
        this.elements.deleteButtons().first().click({ force: true });
        this.confirmDelete();
        this.elements.unitNumberCells().should('have.length', extras - index);
      });
    });
    this.elements.unitNumberCells().should('have.length', 1);
    this.elements.priceListButton().should('be.visible');
    return this;
  }

  deleteLastUnit() {
    this.elements.deleteButtons().should('have.length', 1);
    this.elements.deleteButtons().first().click({ force: true });
    this.confirmDelete();
    return this;
  }

  assertPriceListDeleted() {
    cy.get('span[aria-label="0"]').should('not.exist');
    cy.contains('button', 'Listas de precios').should('be.visible');
    return this;
  }

  assertNoUnitsLeft() {
    this.elements.unitNumberCells().should('not.exist');
    return this;
  }
}

export default new GrillaUnidadesPage();
