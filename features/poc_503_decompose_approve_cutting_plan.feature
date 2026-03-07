@e2e @ui @api @poc503
Feature: POC-503 happy path for decomposition approval and cutting plan generation

  Scenario: Import project, approve decomposition, and generate cutting plan successfully
    Given the frontend is available
    And the backend API is available
    When I open the frontend path "/furniture"
    Then I should see the selector "app-furniture-composer"
    When I import the furniture design YAML fixture "designs/sample-kitchen.design.yaml"
    Then I should see a project item named "E2E YAML Fixture Kitchen"
    And I should see a module item named "Pantry Tower"

    When I open the frontend path "/decomposition"
    Then the frontend URL should contain "/decomposition"
    And I should see the selector "app-decomposition-review"
    And I should see the selector "app-decomposition-review button:has-text('Approve Snapshot')"
    When I click text "Approve Snapshot"
    Then I should see text "Snapshot Approved"

    When I open the frontend path "/cutting-plan"
    Then the frontend URL should contain "/cutting-plan"
    And I should see the selector "app-cutting-plan2d"
    And I should see text "Generated"
    And I should see the selector "app-cutting-plan2d .sheet-list button"

    When I send a POST request to the backend path "/cutting-plans/plan" with JSON:
      """
      stock:
        sheetWidth: 2800
        sheetHeight: 2070
        kerf: 3.175
        edgeBand: 2
        sheetThickness: 18
        allowRotate: true
        margin: 0
      parts:
        - id: poc503-part-1
          partType: CARCASS_LEFT
          bodyId: 1
          width: 720
          height: 560
          allowRotate: true
          mustAlign: false
      """
    Then the API response status should be 200
    And the API response JSON should contain:
      """
      status: OK
      stats:
        sheetCount: 1
      """
