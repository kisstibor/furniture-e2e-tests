# Furniture E2E BDD Tests

Standalone BDD end-to-end framework for `diyfurniture` using:

- `@cucumber/cucumber` (Gherkin/BDD)
- `Playwright` (frontend/browser automation)
- direct backend API assertions (`fetch`)
- optional SQL DB assertions (`postgres`, `mysql`, `mssql`)

## Goals

- Drive the frontend like a user
- Verify backend API responses
- Verify backend persistence/correctness with DB checks
- Keep scenarios readable and verbose

## Quick Start

1. Install dependencies:

```bash
npm install
npm run install:browsers
```

2. Copy env config:

```bash
copy .env.example .env
```

3. Run smoke tests (frontend + demo backend are auto-started if needed):

```bash
npm run test:smoke
```

If you already started services manually and want to reuse them:

```bash
npm run test:smoke:manual
```

## Managed Services (Optional)

Set these to `true` if you want the test harness to start services for you:

- `E2E_START_FRONTEND=true`
- `E2E_START_BACKEND=true`

Commands and working directories are configurable via:

- `E2E_FRONTEND_CMD`, `E2E_FRONTEND_CWD`, `E2E_FRONTEND_WAIT_ON`
- `E2E_BACKEND_CMD`, `E2E_BACKEND_CWD`, `E2E_BACKEND_WAIT_ON`

## DB Assertions

Configure SQL DB access with:

- `E2E_DB_DIALECT` = `postgres` | `mysql` | `mssql`
- `E2E_DB_HOST`, `E2E_DB_PORT`, `E2E_DB_NAME`, `E2E_DB_USER`, `E2E_DB_PASSWORD`

Example steps:

- `When I run SQL query:`
- `Then the SQL result should return 1 rows`
- `Then the SQL first row should contain JSON:`
- `Then I remember the API response JSON field "id" as "projectId"`
- use `{{projectId}}` in SQL docstrings

## Artifacts

Failed scenarios automatically save screenshots to `artifacts/`.

## YAML Fixture-Based E2E Tests

You can load design fixtures from files under `fixtures/` and test the import flow through the frontend.

Example scenario step:

- `When I import the furniture design YAML fixture "designs/sample-kitchen.design.yaml"`

Reusable UI steps added:

- `When I upload the fixture file "<path>" into the selector "<css>"`
- `When I import the furniture design YAML fixture "<path>"`
- `Then I should see a project item named "<name>"`
- `Then I should see a module item named "<name>"`

Run YAML fixture tests:

```bash
npm run test:yaml
```

## Recommended Test Strategy

- `@smoke`: fast UI + API happy paths
- `@yaml`: fixture-driven UI imports and regression checks using design YAML files
- `@e2e`: end-to-end workflows (project creation, decomposition, cutting plan)
- `@db`: persistence verification scenarios
- `@manual`: examples/templates excluded from default runs
