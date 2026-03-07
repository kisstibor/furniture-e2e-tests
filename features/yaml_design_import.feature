@yaml @e2e
Feature: Import furniture design YAML fixtures

  Scenario: Import a furniture design YAML fixture into the composer
    Given the frontend is available
    And the backend API is available
    When I open the frontend path "/furniture"
    Then I should see the selector "app-furniture-composer"
    When I import the furniture design YAML fixture "designs/sample-kitchen.design.yaml"
    Then I should see a project item named "E2E YAML Fixture Kitchen"
    And I should see a module item named "Pantry Tower"
    And I should see a module item named "Base Cabinet 1"
    And I should see a module item named "Base Cabinet 2"

  Scenario: Import a regression fixture through the frontend file input
    Given the frontend is available
    And the backend API is available
    When I open the frontend path "/furniture"
    Then I should see the selector "app-furniture-composer"
    And I should see the selector "input[type=\"file\"][accept*=\".yaml\"]"
    When I upload the fixture file "designs/regression-multi-module-galley.design.yaml" into the selector "input[type=\"file\"][accept*=\".yaml\"]"
    Then I should see a project item named "Regression Fixture - Multi Module Galley"
    And I should see a module item named "Sink Base"
    And I should see at least 5 module items
