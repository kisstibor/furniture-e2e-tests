@smoke @ui @api
Feature: Furniture app smoke checks

  Scenario: Login page loads and backend health is reachable
    Given the frontend is available
    And the backend API is available
    When I open the frontend path "/login"
    Then I should see the selector "app-login"
    When I send a GET request to the backend path "/health"
    Then the API response status should be 200
    And the API response JSON should contain:
      """
      ok: true
      """
