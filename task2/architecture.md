# Repository Architecture

## Overview

The repository separates presentation, backend logic, documentation, and tests so that each responsibility has a clear boundary.

```text
User
  |
  v
Client / UI
  |
  v
API Client
  |
  v
Server / REST API
  |
  v
Data Access
```

## Boundary Rules

| Area | Responsibility | Should not contain |
|---|---|---|
| client | UI, accessibility, responsive behaviour | database logic |
| server | API, validation, business logic | presentation markup |
| docs | requirements, audit evidence, decisions | application runtime logic |
| tests | verification and test plans | production business logic |

## Maintainability

The structure keeps accessibility and quality checks visible alongside the application code. It also allows the client and server to evolve independently while communicating through an API boundary.
