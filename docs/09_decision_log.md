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

#Decision 003 - Background Job Architecture for Notifications
Decision

The Healthcare Monitoring AI Agent will use Celery + Redis + Celery Beat for all asynchronous background processing.

The reminder system will follow a time-based polling architecture, where Celery Beat periodically checks the PostgreSQL database for due reminders and queues background tasks for Celery workers.

Context

The application requires reliable background execution for:

Medication reminders
Appointment reminders
Email notifications
Future AI report generation
Future risk assessment jobs
Other long-running asynchronous operations

The architecture must be reliable, scalable, and suitable for production environments while remaining maintainable for the project.

Alternatives Considered
Option 1 — APScheduler (In-Process Scheduler)

Pros

Very easy to implement
Minimal infrastructure
Suitable for local demos

Cons

Scheduler stops if the FastAPI application stops.
Does not scale across multiple FastAPI instances.
Multiple application instances may send duplicate reminders.
Background processing remains tightly coupled to the API server.

Decision

Rejected because it does not satisfy production reliability requirements.

Option 2 — FastAPI BackgroundTasks

Pros

Built into FastAPI
Very simple

Cons

Designed for request-specific background work.
Cannot perform recurring scheduled jobs.
Not appropriate for reminder scheduling.

Decision

Rejected because it is the wrong abstraction for recurring notification systems.

Option 3 — Event-Driven Scheduling

Each medication or appointment would immediately create a scheduled job that executes at the exact reminder time.

Pros

Very efficient
No periodic database polling
Excellent for extremely large systems

Cons

Every update requires cancelling and recreating scheduled jobs.
Increased architectural complexity.
Harder to maintain consistency when appointments or medications change.
Considerably more difficult to debug.

Decision

Rejected due to unnecessary complexity for the expected project scale.

Option 4 — Celery + Redis + Celery Beat (Selected)

Architecture

Celery Beat
      │
      ▼
Query PostgreSQL
      │
      ▼
Create Reminder Tasks
      │
      ▼
Redis Message Broker
      │
      ▼
Celery Workers
      │
      ▼
Email Provider

Pros

Production-proven architecture
Scheduler independent of FastAPI
Workers can scale horizontally
Supports retries
Suitable for future AI background jobs
Keeps HTTP requests fast
Separates scheduling, execution, and API responsibilities

Cons

Additional infrastructure
Slightly higher deployment complexity

Decision

Selected.

Reminder Scheduling Strategy

The project will use time-based polling.

Every minute:

Celery Beat queries PostgreSQL.
It identifies medications and appointments requiring reminders.
Reminder tasks are placed into Redis.
Celery Workers process tasks asynchronously and send emails.
Reason for Choosing Polling Instead of Event Scheduling

The PostgreSQL database remains the single source of truth.

If users:

modify medications,
reschedule appointments,
deactivate reminders,

no scheduled jobs need to be cancelled or recreated.

The next polling cycle automatically reads the latest state from the database, significantly reducing synchronization complexity while maintaining excellent reliability.

Architectural Principles
FastAPI handles HTTP requests only.
Celery Beat handles scheduling only.
Redis acts as the message broker only.
Celery Workers execute background jobs only.
Business logic remains inside the Service layer.
Database remains the single source of truth.
Future Reuse

The same background processing infrastructure will also be used for:

AI Health Insight generation
Risk Assessment
Weekly Health Reports
Email Reports
Future notification channels