@manual @db
Feature: SQL database verification examples

  Scenario: Verify a persisted project row exists in the database
    Given the SQL database connection is configured
    When I send a POST request to the backend path "/projects/save" with JSON:
      """
      ownerId: bdd-user-1
      name: My project
      snapshot:
        kind: e2e
        version: 1
      """
    Then the API response status should be 200
    And I remember the API response JSON field "id" as "projectId"
    When I run SQL query:
      """
      SELECT id, owner_id, name
      FROM projects
      WHERE id = '{{projectId}}';
      """
    Then the SQL result should return 1 rows
    And the SQL first row should contain JSON:
      """
      owner_id: bdd-user-1
      name: My project
      """
