// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

describe('Import page', () => {

  it('can load external URLs', () => {
    cy.visit('/content')
    cy.contains('Import URL').click();
    cy.get('#urlloader input[type="text"]').type('bgior.com/misc/externalFile.json'); // A copy of this file is on this repo
    cy.contains('OK').click();
    cy.contains('Test Source');
    cy.contains('Spells').click();
    cy.get('.spell:visible').should('have.length', 1).contains('Bee Tornado');
  });

  it('can load the SRD', () => {
    cy.visit('/content')
    cy.contains('Load SRD').click();
    cy.contains('SRD 5.1');
    cy.contains('Spells').click();
    cy.get('.spell').should('have.length', 319);
  });

  it('can delete sources', () => {
    cy.visit('/content')
    // Delete source individually
    cy.contains('Load SRD').click();
    cy.contains('SRD 5.1').closest('.source').find('.source-delete').click();
    cy.get('.source').should('have.length', 0);
    // Delete all sources
    cy.contains('Load SRD').click();
    cy.contains('Delete all').click();
    cy.get('.source').should('have.length', 0);
  });

});