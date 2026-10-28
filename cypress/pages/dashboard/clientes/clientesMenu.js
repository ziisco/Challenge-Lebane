class ClientesMenu {
  elements = {
    unidades: () => cy.contains('[role="menuitem"]', 'Unidades')
  };

  clickUnidades() {
    this.elements.unidades().should('be.visible').click();
    cy.url({ timeout: 30000 }).should('include', '/areas');
    return this;
  }
}

export default new ClientesMenu();
