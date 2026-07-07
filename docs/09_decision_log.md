# Decision 001 — Project Architecture and Technology Stack

**Date:** 2026-07-07

## Context

Before implementation began, the project required a clear architectural direction and technology stack to ensure scalability, maintainability, and alignment with the internship requirements.

## Decision

* Adopt a layered backend architecture consisting of:

  * API Layer
  * Service Layer
  * Repository Layer
  * Database Layer
  * AI Agent Layer
* Use **FastAPI** as the backend framework.
* Use **PostgreSQL** as the primary database.
* Use **SQLAlchemy 2.x** as the ORM.
* Use **Alembic** for database migrations.
* Use **Pydantic** for validation and configuration.
* Use **Google Gemini** as the primary LLM provider through the official `google-genai` SDK.
* Organize the backend into dedicated packages (`api`, `services`, `repositories`, `models`, `agents`, `tools`, `core`, `database`, etc.).

## Rationale

The selected architecture emphasizes separation of concerns, maintainability, scalability, and compatibility with modern Python backend development. The chosen technology stack aligns with the internship requirements while remaining flexible enough to support future migration to other LLM providers.

## Consequences

* The project follows a modular architecture.
* AI provider implementations remain replaceable.
* Future features can be added without major structural changes.
* The codebase remains suitable for production-scale growth and portfolio presentation.

# Decision 002 — Centralized Configuration and Database Foundation

**Date:** 2026-07-08

## Context

The backend required a maintainable foundation for configuration management and database access before implementing business logic and API endpoints.

## Decision

* Use **Pydantic Settings** as the centralized configuration system.
* Store backend environment variables in `backend/.env`.
* Access configuration exclusively through a singleton `settings` object.
* Use **SQLAlchemy 2.x** as the ORM.
* Separate database responsibilities into:

  * `engine.py` — Engine creation
  * `session.py` — Session factory
  * `base.py` — Declarative base
* Use FastAPI's **Lifespan API** instead of the deprecated `@app.on_event("startup")`.
* Verify the PostgreSQL connection during application startup.

## Rationale

This architecture separates configuration, connection management, and model definitions while following modern FastAPI and SQLAlchemy best practices. It also avoids deprecated APIs and prepares the project for scalable development.

## Consequences

* Configuration has a single source of truth.
* Database infrastructure is reusable across all future models.
* Every request can later receive its own SQLAlchemy session through dependency injection.
* The project follows current framework recommendations and is easier to maintain.
