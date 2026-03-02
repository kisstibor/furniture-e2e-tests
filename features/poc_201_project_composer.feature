@e2e @ui @poc201
Feature: POC-201 project composer happy path

  Scenario: Create project, add/select multiple modules, and keep data after reload
    Given the frontend is available
    And the backend API is available
    When I open the frontend path "/furniture"
    Then I should see the selector "app-furniture-composer"
    When I fill the selector ".composer-panel .panel-section:nth-of-type(1) .project-row .text-input" with "POC201 E2E Project"
    And I click the selector ".composer-panel .panel-section:nth-of-type(1) .project-row button"
    Then I should see a project item named "POC201 E2E Project"
    And I should see the selector ".composer-panel .panel-section:nth-of-type(1) .project-list .project-item.active:has-text('POC201 E2E Project')"
    When I click the selector ".composer-panel .panel-section:nth-of-type(2) .module-actions button"
    And I click the selector ".composer-panel .panel-section:nth-of-type(2) .module-actions button"
    Then I should see at least 2 module items
    And I should see a module item named "Module 1"
    And I should see a module item named "Module 2"
    When I click text "Module 1"
    Then I should see the selector ".composer-panel .panel-section:nth-of-type(2) .project-list .project-item.active:has-text('Module 1')"
    When I click text "Module 2"
    Then I should see the selector ".composer-panel .panel-section:nth-of-type(2) .project-list .project-item.active:has-text('Module 2')"
    When I reload the current page
    Then I should see a project item named "POC201 E2E Project"
    And I should see at least 2 module items
    And I should see a module item named "Module 1"
    And I should see a module item named "Module 2"
    And I should see the selector ".composer-panel .panel-section:nth-of-type(1) .project-list .project-item.active:has-text('POC201 E2E Project')"
    And I should see the selector ".composer-panel .panel-section:nth-of-type(2) .project-list .project-item.active:has-text('Module 2')"
