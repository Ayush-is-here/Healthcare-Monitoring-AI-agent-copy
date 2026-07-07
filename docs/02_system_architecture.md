                                      USERS
                (Patient / Doctor / Caregiver / Admin)
                                             │
                                             ▼
──────────────────────────────────────────────────────────────────────
                    React / Next.js + Tailwind + Chart.js
──────────────────────────────────────────────────────────────────────
                     Dashboard │ Chat │ Reports │ Analytics
                                             │
                                             ▼
──────────────────────────────────────────────────────────────────────
                     API Gateway (FastAPI)
──────────────────────────────────────────────────────────────────────
        │               │                 │                 │
        ▼               ▼                 ▼                 ▼
 Authentication     Health Core      AI Gateway      Notification API
 (JWT/RBAC)         Services         (LangGraph)     (Alerts/Email)
        │               │                 │
        │               │                 ▼
        │               │        LangGraph Agent
        │               │
        │               ▼
        │       Health Analytics Service
        │
        └───────────────┬─────────────────────────────────────────────┐
                        ▼                                             ▼
                Tool Registry                                  Safety Layer
                        │                               (Disclaimers, Validation,
                        │                                Medical Boundaries)
        ┌───────────────┼────────────────────────────────────────────────────┐
        ▼               ▼                 ▼                 ▼                ▼
 Medication       Fitness Tool     Nutrition Tool   Symptoms Tool   Medical Research
    Tool                                                  Tool          (MedlinePlus)
        │
        ▼
──────────────────────────────────────────────────────────────────────
               Repository / Persistence Layer
──────────────────────────────────────────────────────────────────────
        │
        ├── PostgreSQL
        ├── Redis
        └── Celery (Background Jobs)

──────────────────────────────────────────────────────────────────────
                External APIs & Healthcare Services
──────────────────────────────────────────────────────────────────────
Google Fit
Fitbit
Nutrition APIs
MedlinePlus
Indian Health APIs
Email/SMS
(Webhooks & HL7 FHIR-ready Extension)