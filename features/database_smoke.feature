@db @ci
Feature: SQL adapter smoke checks

  Scenario: Postgres connection is reachable from the E2E framework
    Given the SQL database connection is configured
    When I run SQL query:
      """
      SELECT 1 AS one, 'ok' AS status;
      """
    Then the SQL result should return 1 rows
    And the SQL first row should contain JSON:
      """
      one: 1
      status: ok
      """
