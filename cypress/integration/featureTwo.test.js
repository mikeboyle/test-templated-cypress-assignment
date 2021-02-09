describe('feature two', () => {
  it('has a main header', () => {
    cy.visit('./index.html');
    cy.get('h1').contains('Hello World');
  });
});
