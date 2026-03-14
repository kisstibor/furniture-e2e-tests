@e2e @ui @composer-sync
Feature: Composer login reconciliation

  Scenario: Login imports remote composer projects into a clean browser session
    Given the frontend is available
    And the backend API is available
    And the auth user exists in the backend with JSON:
      """
      name: Composer Sync E2E
      email: composer-sync-e2e@test.ro
      password: 1234qwer
      """
    When I send a POST request to the backend path "/projects/save" with JSON:
      """
      ownerId: u_email:composer-sync-e2e@test.ro
      projectId: composer-project-cache-101
      name: Joska [composer cache]
      snapshot:
        kind: composer-project-cache
        version: 1
        localProjectId: 101
        modelVersion: 118
        updatedAt: 2026-03-14T18:20:13.931Z
        clientId: e2e-composer-sync
        contentHash: fnv1a_joska_e2e
        payload:
          project:
            name: Joska
            createdAt: 2026-03-14T18:00:00.000Z
          modules:
            - id: 1
              label: Nagy Szekreny
              width: 1000
              height: 2223
              depth: 500
              posX: 0
              posY: 0
              posZ: 0
              rotationY: 0
              snapshot: null
            - id: 2
              label: Module 2
              width: 1200
              height: 820
              depth: 560
              posX: 1000
              posY: 1380
              posZ: 0
              rotationY: 0
              snapshot: null
            - id: 3
              label: Module 3
              width: 1200
              height: 820
              depth: 560
              posX: 2200
              posY: 1380
              posZ: 0
              rotationY: 0
              snapshot: null
            - id: 4
              label: Module 4
              width: 1200
              height: 620
              depth: 400
              posX: 1000
              posY: 0
              posZ: 0
              rotationY: 0
              snapshot: null
            - id: 5
              label: Module 5
              width: 1200
              height: 620
              depth: 400
              posX: 2200
              posY: 0
              posZ: 0
              rotationY: 0
              snapshot: null
      """
    Then the API response status should be 200
    When I send a POST request to the backend path "/projects/save" with JSON:
      """
      ownerId: u_email:composer-sync-e2e@test.ro
      projectId: composer-project-cache-102
      name: Joska 3 [composer cache]
      snapshot:
        kind: composer-project-cache
        version: 1
        localProjectId: 102
        modelVersion: 379
        updatedAt: 2026-03-14T18:12:01.344Z
        clientId: e2e-composer-sync
        contentHash: fnv1a_joska3_e2e
        payload:
          project:
            name: Joska 3
            createdAt: 2026-03-14T18:01:00.000Z
          modules:
            - id: 201
              label: Module A
              width: 900
              height: 2100
              depth: 500
              posX: 0
              posY: 0
              posZ: 0
              rotationY: 0
              snapshot: null
            - id: 202
              label: Module B
              width: 800
              height: 2100
              depth: 500
              posX: 920
              posY: 0
              posZ: 0
              rotationY: 0
              snapshot: null
      """
    Then the API response status should be 200
    When I open the frontend path "/login"
    And I log in through the UI with email "composer-sync-e2e@test.ro" and password "1234qwer"
    Then the frontend URL should contain "/furniture"
    And I should see a project item named "Joska"
    And I should see a project item named "Joska 3"
    When I click text "Joska"
    Then I should see a module item named "Nagy Szekreny"
    And I should see a module item named "Module 2"
    And I should see a module item named "Module 3"
    And I should see a module item named "Module 4"
    And I should see a module item named "Module 5"
