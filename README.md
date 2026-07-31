
```
Healthcare-ai-platform
├─ backend
│  ├─ alembic
│  │  ├─ env.py
│  │  ├─ README
│  │  ├─ script.py.mako
│  │  └─ versions
│  │     ├─ 05e10e98e731_create_medications_table.py
│  │     ├─ 231d908ac8b8_create_appointments_table.py
│  │     ├─ 41d27d2bf5b1_create_health_metrics_table.py
│  │     ├─ 5075812fb590_create_medication_reminders_table.py
│  │     ├─ 5dad86cc1f4b_adding_caregiver_in_userrole_enum.py
│  │     ├─ 7973bcd94bad_add_weight_kg_field_into_patient_.py
│  │     ├─ dc4d57d1989e_create_patient_profile_table.py
│  │     ├─ ed8d0a4ecb47_initial_migration.py
│  │     └─ f80615ff22b9_add_weight_kg_field_into_patient_.py
│  ├─ alembic.ini
│  ├─ app
│  │  ├─ agents
│  │  │  ├─ graph.py
│  │  │  ├─ health_agent.py
│  │  │  ├─ nodes.py
│  │  │  ├─ state.py
│  │  │  └─ __init__.py
│  │  ├─ api
│  │  │  ├─ routes
│  │  │  │  ├─ ai
│  │  │  │  │  └─ health_insight.py
│  │  │  │  ├─ appointment.py
│  │  │  │  ├─ auth.py
│  │  │  │  ├─ dashboard.py
│  │  │  │  ├─ health_metric.py
│  │  │  │  ├─ medication.py
│  │  │  │  ├─ medication_reminder.py
│  │  │  │  ├─ profile.py
│  │  │  │  └─ __init__.py
│  │  │  └─ __init__.py
│  │  ├─ core
│  │  │  ├─ celery_app.py
│  │  │  ├─ config.py
│  │  │  ├─ enums
│  │  │  │  ├─ notification_channel.py
│  │  │  │  ├─ notification_type.py
│  │  │  │  └─ rule_priority.py
│  │  │  ├─ exceptions
│  │  │  │  ├─ ai.py
│  │  │  │  └─ exception_handler.py
│  │  │  ├─ permissions.py
│  │  │  ├─ security.py
│  │  │  └─ __init__.py
│  │  ├─ database
│  │  │  ├─ base.py
│  │  │  ├─ engine.py
│  │  │  ├─ session.py
│  │  │  └─ __init__.py
│  │  ├─ dependencies
│  │  │  ├─ ai.py
│  │  │  ├─ notification.py
│  │  │  └─ __init__.py
│  │  ├─ domain
│  │  │  └─ notification_content.py
│  │  ├─ dto
│  │  │  ├─ notification_dto.py
│  │  │  └─ __init__.py
│  │  ├─ integrations
│  │  │  └─ __init__.py
│  │  ├─ llms
│  │  ├─ main.py
│  │  ├─ middleware
│  │  │  └─ __init__.py
│  │  ├─ models
│  │  │  ├─ appointment.py
│  │  │  ├─ enum.py
│  │  │  ├─ health_metric.py
│  │  │  ├─ medication.py
│  │  │  ├─ medication_reminder.py
│  │  │  ├─ patient_profile.py
│  │  │  ├─ user.py
│  │  │  └─ __init__.py
│  │  ├─ repositories
│  │  │  ├─ appointment_repository.py
│  │  │  ├─ health_metric_repository.py
│  │  │  ├─ medication_reminder_repository.py
│  │  │  ├─ medication_repository.py
│  │  │  ├─ profile_repository.py
│  │  │  ├─ user_repository.py
│  │  │  └─ __init__.py
│  │  ├─ schemas
│  │  │  ├─ ai
│  │  │  │  ├─ appointment_context.py
│  │  │  │  ├─ health_context.py
│  │  │  │  ├─ health_insight_response.py
│  │  │  │  ├─ latest_metric_context.py
│  │  │  │  ├─ medication_context.py
│  │  │  │  ├─ patient_context.py
│  │  │  │  └─ __init__.py
│  │  │  ├─ analytics
│  │  │  │  ├─ dashboard_analytics.py
│  │  │  │  └─ __init__.py
│  │  │  ├─ appointment.py
│  │  │  ├─ dashboard
│  │  │  │  └─ dashboard.py
│  │  │  ├─ health_metric.py
│  │  │  ├─ medication.py
│  │  │  ├─ medication_reminder.py
│  │  │  ├─ patient_profile.py
│  │  │  ├─ rule_engine
│  │  │  │  ├─ rule_evaluation_result.py
│  │  │  │  └─ rule_result.py
│  │  │  ├─ user.py
│  │  │  └─ __init__.py
│  │  ├─ services
│  │  │  ├─ ai
│  │  │  │  ├─ adapters
│  │  │  │  │  ├─ base_ai_adapter.py
│  │  │  │  │  └─ gemini_adapter.py
│  │  │  │  ├─ context_builder
│  │  │  │  │  ├─ appointment_context_builder.py
│  │  │  │  │  ├─ health_context_builder.py
│  │  │  │  │  ├─ medication_context_builder.py
│  │  │  │  │  ├─ metric_context_builder.py
│  │  │  │  │  └─ patient_context_builder.py
│  │  │  │  ├─ health_context_service.py
│  │  │  │  ├─ health_insight_service.py
│  │  │  │  ├─ prompt
│  │  │  │  │  ├─ prompt_builder.py
│  │  │  │  │  └─ system_instruction.py
│  │  │  │  └─ rule_engine
│  │  │  │     ├─ engine.py
│  │  │  │     ├─ registry.py
│  │  │  │     └─ rules
│  │  │  │        ├─ base_rule.py
│  │  │  │        └─ metric
│  │  │  │           └─ high_heart_rate_rule.py
│  │  │  ├─ analytics
│  │  │  │  ├─ analytics_service.py
│  │  │  │  ├─ appointment_analytics.py
│  │  │  │  ├─ health_metric_analytics.py
│  │  │  │  ├─ medication_analytics.py
│  │  │  │  └─ __init__.py
│  │  │  ├─ appointment_service.py
│  │  │  ├─ dashboard
│  │  │  │  ├─ dashboard_service.py
│  │  │  │  └─ __init__.py
│  │  │  ├─ email
│  │  │  │  ├─ email_client.py
│  │  │  │  └─ resend_email_client.py
│  │  │  ├─ health_metric_service.py
│  │  │  ├─ medication_reminder_service.py
│  │  │  ├─ medication_service.py
│  │  │  ├─ notification_channel_router.py
│  │  │  ├─ notification_service.py
│  │  │  ├─ notification_template_service.py
│  │  │  ├─ profile_service.py
│  │  │  ├─ senders
│  │  │  │  ├─ email_sender.py
│  │  │  │  ├─ notification_sender.py
│  │  │  │  ├─ notification_sender_factory.py
│  │  │  │  └─ push_sender.py
│  │  │  └─ __init__.py
│  │  ├─ tools
│  │  │  └─ __init__.py
│  │  ├─ utils
│  │  │  └─ __init__.py
│  │  ├─ workers
│  │  │  ├─ medication_reminder.py
│  │  │  ├─ tasks.py
│  │  │  └─ __init__.py
│  │  └─ __init__.py
│  ├─ celerybeat-schedule
│  ├─ Dockerfile
│  ├─ requirements.txt
│  └─ tests
│     ├─ manual
│     │  ├─ notification_test.py
│     │  └─ __init__.py
│     └─ __init__.py
├─ docker
├─ docs
│  ├─ 00_project_charter.md
│  ├─ 01_requirements_traceability.md
│  ├─ 02_system_architecture.md
│  ├─ 03_engineering_execution_plan.md
│  ├─ 04_database_design.md
│  ├─ 05_api_design.md
│  ├─ 06_ai_agent_architecture.md
│  ├─ 07_deployment_architecture.md
│  ├─ 08_testing_strategy.md
│  ├─ 09_decision_log.md
│  ├─ 10_final_submission_checklist.md
│  ├─ 11_backend_architecture.md
│  └─ 12_notification_system.md
├─ frontend
│  ├─ components.json
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ api
│  │  ├─ app
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ layout
│  │  │  ├─ shared
│  │  │  └─ ui
│  │  │     ├─ avatar.tsx
│  │  │     ├─ badge.tsx
│  │  │     ├─ button.tsx
│  │  │     ├─ calendar.tsx
│  │  │     ├─ card.tsx
│  │  │     ├─ checkbox.tsx
│  │  │     ├─ dialog.tsx
│  │  │     ├─ dropdown-menu.tsx
│  │  │     ├─ input.tsx
│  │  │     ├─ label.tsx
│  │  │     ├─ popover.tsx
│  │  │     ├─ scroll-area.tsx
│  │  │     ├─ select.tsx
│  │  │     ├─ separator.tsx
│  │  │     ├─ sheet.tsx
│  │  │     ├─ sidebar.tsx
│  │  │     ├─ skeleton.tsx
│  │  │     ├─ sonner.tsx
│  │  │     ├─ switch.tsx
│  │  │     ├─ table.tsx
│  │  │     ├─ tabs.tsx
│  │  │     ├─ textarea.tsx
│  │  │     └─ tooltip.tsx
│  │  ├─ features
│  │  ├─ hooks
│  │  │  └─ use-mobile.ts
│  │  ├─ index.css
│  │  ├─ layouts
│  │  ├─ main.tsx
│  │  ├─ providers
│  │  ├─ routes
│  │  ├─ styles
│  │  ├─ types
│  │  └─ utils
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ README.md
└─ scripts

```