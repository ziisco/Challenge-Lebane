class DashboardPage {
  elements = {
    addProjectButton: () => cy.contains('Agregar proyecto'),
    menuButton: () => cy.get('button[aria-label="menu"]'),
    clientesMenu: () => cy.get('[data-cy="sidebar-clientes"]').closest('li')
  };

  clickAddProject() {
    this.elements.addProjectButton().should('be.visible').click();
    return this;
  }

  openSidebar() {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="sidebar-clientes"]:visible').length === 0) {
        this.elements.menuButton().click();
      }
    });
    this.elements.clientesMenu().should('be.visible');
    return this;
  }

  clickClientes() {
    this.openSidebar();
    this.elements.clientesMenu().click();
    return this;
  }
}

export default new DashboardPage();
