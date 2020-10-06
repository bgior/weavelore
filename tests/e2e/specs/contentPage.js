// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

describe('Content page', () => {

  it('can load external URLs', () => {
    cy.visit('/content');
    cy.get('.source-action').last().click(); // Delete the default SRD
    cy.contains('Import URL').click();
    cy.get('#urlloader input[type="text"]').type('files.bgior.com/weavelore/externalFile.json'); // A copy of this file is on this repo
    cy.contains('OK').click();
    cy.contains('Test Source');
    cy.contains('Spells').click();
    cy.get('.spell:visible').should('have.length', 1).contains('Bee Tornado');
  });

  it('can load the SRD', () => {
    cy.visit('/content');
    cy.get('.source-action').last().click(); // Delete the default SRD
    cy.contains('Load SRD').click();
    cy.contains('SRD 5.1');
    cy.contains('Spells').click();
    cy.get('.spell').should('have.length', 319);
  });

  it('can create, edit, save and delete sources', () => {
    cy.visit('/content');

    // Create a new source, edit and save it
    cy.contains('New source').click();
    cy.get('.source-action[title="Edit this source"]').last().click(); // Toggle edition mode
    cy.get('.font-weight-bold').type("{selectall}{backspace}Source name!");
    cy.get('textarea.form-control').type("{selectall}{backspace}Source description!");
    cy.get('*[title="Version number for this source"]').type("{selectall}{backspace}97");
    cy.contains('Save changes').click();

    // Check if it persisted correctly
    cy.visit('/content');
    cy.get('.source').should('have.length', 2);
    cy.get('.source-action[title="Edit this source"]').last().click();
    cy.get('.font-weight-bold').should("have.value", "Source name!");
    cy.get('textarea.form-control').should("have.value", "Source description!");
    cy.get('*[title="Version number for this source"]').should("have.value", "97");

    // Delete source individually
    cy.get('.source-action').last().click(); // Click on the delete button
    cy.get('.source').should('have.length', 1);

    // Check if it persisted correctly
    cy.visit('/content');
    cy.get('.source').should('have.length', 1);
  });

  it('can delete all sources', () => {
    cy.visit('/content');
    cy.contains('New source').click();
    cy.get('.source').should('have.length', 2);
    cy.contains('Delete all').click();
    cy.get('.source').should('have.length', 0);
  });

});
