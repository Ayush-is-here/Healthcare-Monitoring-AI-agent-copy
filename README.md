
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
│  │     ├─ dc4d57d1989e_create_patient_profile_table.py
│  │     └─ ed8d0a4ecb47_initial_migration.py
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
│  │  │  │  ├─ appointment.py
│  │  │  │  ├─ auth.py
│  │  │  │  ├─ health_metric.py
│  │  │  │  ├─ medication.py
│  │  │  │  ├─ profile.py
│  │  │  │  └─ __init__.py
│  │  │  └─ __init__.py
│  │  ├─ core
│  │  │  ├─ celery_app.py
│  │  │  ├─ config.py
│  │  │  ├─ enums
│  │  │  │  ├─ notification_channel.py
│  │  │  │  └─ notification_type.py
│  │  │  ├─ exception_handler.py
│  │  │  ├─ permissions.py
│  │  │  ├─ security.py
│  │  │  └─ __init__.py
│  │  ├─ database
│  │  │  ├─ base.py
│  │  │  ├─ engine.py
│  │  │  ├─ session.py
│  │  │  └─ __init__.py
│  │  ├─ dto
│  │  │  ├─ notification.py
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
│  │  │  ├─ appointment.py
│  │  │  ├─ health_metric.py
│  │  │  ├─ medication.py
│  │  │  ├─ patient_profile.py
│  │  │  ├─ user.py
│  │  │  └─ __init__.py
│  │  ├─ services
│  │  │  ├─ appointment_service.py
│  │  │  ├─ health_metric_service.py
│  │  │  ├─ medication_service.py
│  │  │  ├─ notification_service.py
│  │  │  ├─ profile_service.py
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
│  ├─ celerybeat-schedule-shm
│  ├─ celerybeat-schedule-wal
│  ├─ Dockerfile
│  ├─ requirements.txt
│  └─ tests
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
│  └─ 11_backend_architecture.md
├─ frontend
├─ README.md
└─ scripts

```
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
│  │     ├─ dc4d57d1989e_create_patient_profile_table.py
│  │     └─ ed8d0a4ecb47_initial_migration.py
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
│  │  │  │  ├─ appointment.py
│  │  │  │  ├─ auth.py
│  │  │  │  ├─ health_metric.py
│  │  │  │  ├─ medication.py
│  │  │  │  ├─ profile.py
│  │  │  │  └─ __init__.py
│  │  │  └─ __init__.py
│  │  ├─ core
│  │  │  ├─ celery_app.py
│  │  │  ├─ config.py
│  │  │  ├─ enums
│  │  │  │  ├─ notification_channel.py
│  │  │  │  └─ notification_type.py
│  │  │  ├─ exception_handler.py
│  │  │  ├─ permissions.py
│  │  │  ├─ security.py
│  │  │  └─ __init__.py
│  │  ├─ database
│  │  │  ├─ base.py
│  │  │  ├─ engine.py
│  │  │  ├─ session.py
│  │  │  └─ __init__.py
│  │  ├─ dependencies
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
│  │  │  ├─ appointment.py
│  │  │  ├─ health_metric.py
│  │  │  ├─ medication.py
│  │  │  ├─ patient_profile.py
│  │  │  ├─ user.py
│  │  │  └─ __init__.py
│  │  ├─ services
│  │  │  ├─ appointment_service.py
│  │  │  ├─ email
│  │  │  │  ├─ email_client.py
│  │  │  │  └─ resend_email_client.py
│  │  │  ├─ health_metric_service.py
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
│  │  ├─ tests
│  │  │  └─ manual
│  │  │     └─ notification_test.py
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
│  ├─ celerybeat-schedule-shm
│  ├─ celerybeat-schedule-wal
│  ├─ Dockerfile
│  └─ requirements.txt
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
│  └─ 11_backend_architecture.md
├─ frontend
├─ README.md
└─ scripts

```