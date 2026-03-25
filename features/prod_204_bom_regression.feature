@e2e @ui @api @bom @prod204
Feature: PROD-204 BOM regression fixtures for pricing validation

  Scenario: Combined kitchen fixture renders mixed materials, drawers, worktops, and joinery in BOM
    Given the frontend is available
    And the backend API is available
    When I open the frontend path "/furniture"
    Then I should see the selector "app-furniture-composer"
    When I import the furniture design YAML fixture "designs/regression-combined-kitchen.design.yaml"
    Then I should see a project item named "Regression Fixture - Combined Kitchen"
    And I should see a module item named "Combined Base Drawer"
    And I should see a module item named "Combined Tall Pantry"

    When I open the frontend path "/decomposition"
    Then I should see the selector "app-decomposition-review"
    When I click text "Approve Snapshot"
    Then I should see text "Snapshot Approved"

    When I open the frontend path "/bill"
    Then the frontend URL should contain "/bill"
    And I should see the selector "app-billofmaterials table.bom-table"
    And I should see text "H1318 ST10 Natural Halifax Oak 18mm"
    And I should see text "Grey 18mm"
    And I should see text "Worktop"
    And I should see text "Side-mount telescopic"
    And I should see text "Cam-and-dowel connector set"
    And I should see text "Confirmat screw 7x50"
    And I should see text "Joinery cost:"
    And I should see text "Material cost:"
