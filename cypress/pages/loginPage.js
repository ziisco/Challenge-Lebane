class LoginPage {
  elements = {
    loginForm: (options) => cy.get('form[name="loginForm"]', options),
    emailInput: () => cy.get('input[name="email"]'),
    passwordInput: () => cy.get('input[name="password"]'),
    rememberCheckbox: () => cy.get('#remember'),
    submitButton: () => cy.get('form[name="loginForm"] button[type="submit"]'),
    title: () => cy.contains('h1', 'Ingresar en Lebane'),
    registerLink: () => cy.contains('span', 'Registrarme'),
    forgotPasswordLink: () => cy.contains('span', 'Recuperar contraseña')
  };

  clearSession() {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();
    return this;
  }

  visit() {
    cy.visit('/sign-in');
    this.clearSession();
    cy.visit('/sign-in');
    this.elements.loginForm({ timeout: 30000 }).should('be.visible');
    return this;
  }

  fillEmail(email) {
    this.elements.emailInput().clear().type(email);
    return this;
  }

  fillPassword(password) {
    this.elements.passwordInput().clear().type(password, { log: false });
    return this;
  }

  setRememberMe(shouldRemember = true) {
    if (shouldRemember) {
      this.elements.rememberCheckbox().check({ force: true });
    } else {
      this.elements.rememberCheckbox().uncheck({ force: true });
    }
    return this;
  }

  clickSubmit() {
    this.elements.submitButton().click();
    return this;
  }

  login(email, password, rememberMe = true) {
    this.fillEmail(email);
    this.fillPassword(password);
    this.setRememberMe(rememberMe);
    this.clickSubmit();
    return this;
  }

  loginWithValidCredentials() {
    this.visit();
    cy.env(['username', 'password']).then(({ username, password }) => {
      this.login(username, password, false);
    });
    return this;
  }

  assertLoginPageIsVisible() {
    cy.url().should('include', '/sign-in');
    this.elements.title().should('be.visible');
    this.elements.emailInput().should('be.visible');
    this.elements.passwordInput().should('be.visible');
    this.elements.submitButton().should('be.visible');
    return this;
  }

  assertSuccessfulLogin() {
    cy.url({ timeout: 30000 }).should('not.include', '/sign-in');
    this.elements.loginForm().should('not.exist');
    return this;
  }
}

export default new LoginPage();
