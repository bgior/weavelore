// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.
// Cypress API reference: https://docs.cypress.io/api/introduction/api.html

describe('Spells page', () => {

  it('opens individual spells correctly', () => {
    cy.visit('/')
    cy.contains('Standard content (SRD)').click();
    cy.contains('Bless').click();
    cy.contains('30 feet');
    cy.contains('Up to 1 minute');
    cy.contains('Concentration');
    cy.contains('1 action');
    cy.contains('SRD 5.1');
    cy.contains('A sprinkling of holy water');
    cy.contains('You bless up to three creatures');
  });

  it('filters spells correctly', () => {
    // The only 1st-level cleric abjuration that contains "ar" should be "Sanctuary"
    cy.visit('/')
    cy.contains('Standard content (SRD)').click();
    cy.contains('Any class').click();
    cy.contains('cleric').click();
    cy.contains('Any level').click();
    cy.contains('1st level').click();
    cy.contains('Any school').click();
    cy.contains('abjuration').click();
    cy.get('.query').type('ar');
    cy.get('.spell:visible').should('have.length', 1).contains('Sanctuary');
  });

  it('favorites and unfavorites correctly', () => {
    cy.visit('/')
    cy.contains('Standard content (SRD)').click();
    // Favorite the spell 'Bless'
    cy.contains('Bless').click();
    cy.get('.spell-favorite').click();
    // Favorite the spell 'Bane'
    cy.contains('Bane').click();
    cy.get('.spell-favorite').click();
    // Go back to unfavorite 'Bless'
    cy.contains('Bless').click();
    cy.get('.spell-favorite').click();
    cy.get('.spell-close').click();
    // Check the favorites filter to ensure only Bane shows up
    cy.get('img[title="Toggle favorites filter"]').click()
    cy.get('.spell:visible').should('have.length', 1).contains('Bane');
  });
})
