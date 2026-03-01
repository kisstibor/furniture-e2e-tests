@decomposition @e2e @ui @api
Feature: Decomposition front and backend coverage

  Scenario: Decomposition page loads and renders core UI regions
    When I open the frontend path "http://localhost:8088/decomposition"
    Then the frontend URL should contain "/decomposition"
    And I should see the selector "app-decomposition-review"
    And I should see text "Decomposition Review"
    And I should see the selector "app-decomposition-review .preview-canvas"
    And I should see the selector "app-decomposition-review .parts-panel"

  Scenario: Backend decomposition endpoint returns decomposed parts for a valid body
    When I send a POST request to the backend path "http://localhost:8088/api/cutting-plans/decompose-v2" with JSON:
      """
      bodies:
        - id: 1
          name: E2E Body
          width: 800
          height: 720
          deepth: 560
          thickness: 18
          includeBack: true
          frontElements: []
          interiorElements: []
      stock:
        sheetWidth: 2800
        sheetHeight: 2070
        kerf: 3.175
        edgeBand: 2
        sheetThickness: 18
        allowRotate: true
        margin: 0
      """
    Then the API response status should be 200
    And the API response JSON should contain:
      """
      parts:
        - id: body-1-left
          partType: CARCASS_LEFT
          bodyId: 1
        - id: body-1-right
          partType: CARCASS_RIGHT
          bodyId: 1
      warnings: []
      """

  Scenario: Backend decomposition endpoint validates missing bodies
    When I send a POST request to the backend path "http://localhost:8088/api/cutting-plans/decompose-v2" with JSON:
      """
      bodies: []
      stock:
        sheetWidth: 2800
        sheetHeight: 2070
      """
    Then the API response status should be 400
    And the API response JSON should contain:
      """
      error: validation_error
      message: At least one body is required.
      """
