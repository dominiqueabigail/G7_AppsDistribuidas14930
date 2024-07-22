describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:4200')
    cy.get('#usuarios').click()
    cy.get('#AgregarUsuario').click()
    //En el input agregar-nombre pon "Juan"
    cy.get('.agregar-nombre').type('Juan Prueba')
    cy.get('.agregar-email').type('juan@gmail.com')
    cy.get('.agregar-password').first().type('juan123');
    cy.get('.agregar-password').last().type('juan123');
    cy.get('.aceptar').click()

    cy.get('#cursos').click()
  })
})