Backend Folder Architecture (v1.0)

backend/
│
├── app/
│   │
│   ├── main.py                 # FastAPI entry point
│   │
│   ├── core/
│   │   ├── config.py           # Settings & environment
│   │   ├── security.py         # JWT, password hashing
│   │   ├── logging.py          # Logging configuration
│   │   ├── exceptions.py       # Global exception handlers
│   │   └── constants.py
│   │
│   ├── api/
│   │   ├── dependencies.py     # Shared dependencies
│   │   ├── router.py           # Root router
│   │   │
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── health.py
│   │       ├── medications.py
│   │       ├── reports.py
│   │       ├── analytics.py
│   │       ├── agent.py
│   │       └── notifications.py
│   │
│   ├── models/                 # SQLAlchemy models
│   │
│   ├── schemas/                # Pydantic schemas
│   │
│   ├── repositories/           # Database operations only
│   │
│   ├── services/               # Business logic
│   │
│   ├── agents/                 # LangGraph workflows
│   │
│   ├── tools/                  # Individual AI tools
│   │
│   ├── database/
│   │   ├── session.py
│   │   ├── base.py
│   │   └── seed.py
│   │
│   ├── integrations/           # Google Fit, Fitbit, etc.
│   │
│   ├── workers/                # Celery tasks
│   │
│   ├── middleware/
│   │
│   ├── utils/
│   │
│   └── tests/
│
├── alembic/
│
├── requirements.txt
│
├── Dockerfile
│
└── .env

Responsibility of Each Folder

| Folder          | Responsibility                                    |
| --------------- | ------------------------------------------------- |
| `core/`         | Configuration, security, logging, global settings |
| `api/`          | HTTP endpoints only (no business logic)           |
| `models/`       | SQLAlchemy database models                        |
| `schemas/`      | Request/Response validation (Pydantic)            |
| `repositories/` | Database queries only                             |
| `services/`     | Business logic                                    |
| `agents/`       | LangGraph graphs, state, orchestration            |
| `tools/`        | Individual AI tools used by the agent             |
| `database/`     | Database engine, session, initialization          |
| `integrations/` | External healthcare APIs                          |
| `workers/`      | Celery background jobs                            |
| `middleware/`   | Authentication, logging, request middleware       |
| `utils/`        | Small reusable helper functions                   |


Request Flow (Golden Rule)

Every request follows the same path:
Client
   │
   ▼
API Route
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Database

If AI is involved:

Client
   │
   ▼
API
   │
   ▼
Service
   │
   ▼
LangGraph Agent
   │
   ▼
Tools
   │
   ▼
Repository / External APIs