@smoke @api
Feature: Backend project API smoke checks

  Scenario: Save and list a project snapshot through the backend API
    When I send a POST request to the backend path "/projects/save" with JSON:
      """
      ownerId: e2e-smoke-user
      name: Smoke Project
      snapshot:
        kind: smoke
        version: 1
      """
    Then the API response status should be 200
    And the API response JSON should contain:
      """
      ownerId: e2e-smoke-user
      name: Smoke Project
      """
    When I send a GET request to the backend path "/projects?ownerId=e2e-smoke-user"
    Then the API response status should be 200
    And the API response JSON array should contain an object with:
      """
      ownerId: e2e-smoke-user
      name: Smoke Project
      """
