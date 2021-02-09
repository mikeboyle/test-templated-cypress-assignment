describe('feature one', () => {
  it('visits the page', () => {
    cy.visit('./index.html');
  });

  it('passes this test', () => {
    expect('foo').to.eq('foo');
  });
});
