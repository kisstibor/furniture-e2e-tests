@e2e @ui @api @poc504
Feature: POC-504 BOM pricing fallback between m2 and full-sheet pricing

  Scenario: BOM chooses the lower price when both m2 and sheet prices are available
    Given the frontend is available
    And the backend API is available
    When I open the frontend path "/furniture"
    Then I should see the selector "app-furniture-composer"
    When I import the furniture design YAML fixture "designs/regression-bom-price-lower.design.yaml"
    Then I should see a project item named "Regression Fixture - BOM Price Lower Rule"
    And I should see a module item named "BOM Price Lower Rule Module"

    When I open the frontend path "/decomposition"
    Then I should see the selector "app-decomposition-review"
    When I click text "Approve Snapshot"
    Then I should see text "Snapshot Approved"

    When I open the frontend path "/bill"
    Then the frontend URL should contain "/bill"
    And I should see the selector "app-billofmaterials table.bom-table"
    And I should see a BOM row for material "H1318 ST10 Natural Halifax Oak 18mm" with pricing mode "sheet"

  Scenario: BOM uses full-sheet pricing path when m2 price is zero
    Given the frontend is available
    And the backend API is available
    When I send a POST request to the backend path "/business/sheet-types" with JSON:
      """
      businessId: dev-egger
      name: E2E m2 zero sheet
      width: 2800
      height: 2070
      thickness: 18
      kerf: 3.175
      edgeBand: 2
      pricePerSquareMeter: 0
      pricePerSheet: 555
      absBands:
        - edgeSizeMm: 23
          thicknessMm: 1.0
      """
    Then the API response status should be 200
    And I remember the API response JSON field "id" as "zeroM2SheetId"

    When I open the frontend path "/furniture"
    Then I should see the selector "app-furniture-composer"
    When I import the furniture design YAML template "designs/regression-bom-m2-zero-template.design.yaml" replacing token "__ZERO_M2_SHEET_ID__" with remembered value "zeroM2SheetId"
    Then I should see a project item named "Regression Fixture - BOM m2 Zero Sheet Path"
    And I should see a module item named "BOM m2 Zero Sheet Path Module"

    When I open the frontend path "/decomposition"
    Then I should see the selector "app-decomposition-review"
    When I click text "Approve Snapshot"
    Then I should see text "Snapshot Approved"

    When I open the frontend path "/bill"
    Then the frontend URL should contain "/bill"
    And I should see the selector "app-billofmaterials table.bom-table"
    And I should see a BOM row for material "E2E m2 zero sheet" with pricing mode "sheet"
