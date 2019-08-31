// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

describe('Spells page', () => {

  it('opens individual rules correctly', () => {
    cy.visit('/');
    cy.contains('Standard content (SRD)').click();
    cy.contains('Rules').click();
    cy.contains('Blinded').click();
    cy.contains('Condition');
    cy.contains('A blinded creature can\'t see and automatically fails any ability check that requires sight.');
    cy.contains('SRD 5.1');
  });

  it('filters rules correctly', () => {
    // The string "rea" should be both in the name of "Areas of Effect" and the tags of "Casting Time"
    cy.visit('/');
    cy.contains('Standard content (SRD)').click();
    cy.contains('Rules').click();
    cy.get('.query').type('rea');
    cy.get('.rule:visible').should('have.length', 2).contains('Areas of Effect');
    cy.get('.rule:visible').contains('Casting Time');
  });
})
