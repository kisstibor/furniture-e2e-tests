@e2e @ui @poc505
Feature: POC-505 drawer slide geometry reacts to slide type and length

  Scenario: Changing drawer slide type and length updates computed drawer box
    Given the frontend is available
    And the backend API is available
    When I open the frontend path "/furniture"
    Then I should see the selector "app-furniture-composer"
    When I import the furniture design YAML fixture "designs/regression-drawer-base.design.yaml"
    Then I should see a project item named "Regression Fixture - Drawer Base"
    And I should see a module item named "Drawer Base 900"
    And I should see the selector ".composer-panel .panel-section:nth-of-type(3) .module-actions button"

    When I click the selector ".composer-panel .panel-section:nth-of-type(3) .module-actions button"
    Then the frontend URL should contain "/module-design"
    And I should see the selector "app-draw2d"

    When I fill the selector "input[name=\"commandInput\"]" with "select 101"
    And I click text "Run"
    Then I should see text "selected element=101"
    And I should see the selector "mat-select[name=\"slideType\"]"
    And I should see the selector "mat-select[name=\"slideLengthMm\"]"
    And I remember the computed drawer box as "drawerBoxBefore"

    When I select mat option "Side-mount (230M/430E)" for mat-select named "slideType"
    And I select mat option "450 mm" for mat-select named "slideLengthMm"
    Then I remember the computed drawer box as "drawerBoxAfter"
    And remembered value "drawerBoxBefore" should differ from remembered value "drawerBoxAfter"
