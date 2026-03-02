@e2e @ui @poc202
Feature: POC-202 decomposition approval gate before cutting plan generation

  Scenario: Cutting plan route is blocked until decomposition snapshot is approved
    Given the frontend is available
    And the backend API is available
    When I open the frontend path "/cutting-plan"
    Then the frontend URL should contain "/decomposition"
    And I should see the selector "app-decomposition-review"
    And I should see the selector "app-decomposition-review button:has-text('Approve Snapshot')"
