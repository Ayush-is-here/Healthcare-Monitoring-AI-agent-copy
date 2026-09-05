
```
Healthcare-ai-platform - Copy
├─ backend
│  ├─ .dockerignore
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
│  │     ├─ b0e44090b447_create_chat_messages_table.py
│  │     ├─ dc4d57d1989e_create_patient_profile_table.py
│  │     ├─ ed8d0a4ecb47_initial_migration.py
│  │     └─ f80615ff22b9_add_weight_kg_field_into_patient_.py
│  ├─ alembic.ini
│  ├─ app
│  │  ├─ agents
│  │  │  ├─ graph.py
│  │  │  ├─ health_agent.py
│  │  │  ├─ nodes.py
│  │  │  ├─ planner.py
│  │  │  ├─ state.py
│  │  │  ├─ tool_executor.py
│  │  │  └─ __init__.py
│  │  ├─ api
│  │  │  ├─ routes
│  │  │  │  ├─ ai
│  │  │  │  │  ├─ chat.py
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
│  │  │  │  ├─ exception_handler.py
│  │  │  │  └─ tools.py
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
│  │  │  ├─ chat.py
│  │  │  ├─ monitoring.py
│  │  │  ├─ notification.py
│  │  │  └─ __init__.py
│  │  ├─ domain
│  │  ├─ dto
│  │  │  ├─ agent
│  │  │  │  ├─ execution_plan.py
│  │  │  │  ├─ execution_result.py
│  │  │  │  └─ tool_payload
│  │  │  │     ├─ base_tool_payload.py
│  │  │  │     ├─ clinical_knowledge
│  │  │  │     │  ├─ clinical_knowledge_payload.py
│  │  │  │     │  └─ research_article.py
│  │  │  │     ├─ medication
│  │  │  │     │  ├─ medication_payload.py
│  │  │  │     │  └─ medication_snapshot.py
│  │  │  │     ├─ tool_error_payload.py
│  │  │  │     └─ tool_result.py
│  │  │  ├─ notification
│  │  │  │  ├─ base_notification.py
│  │  │  │  ├─ health_insight_notification.py
│  │  │  │  ├─ medication_reminder_notification.py
│  │  │  │  ├─ notification_content.py
│  │  │  │  ├─ recipient.py
│  │  │  │  └─ __init__.py
│  │  │  └─ __init__.py
│  │  ├─ integrations
│  │  │  └─ __init__.py
│  │  ├─ llms
│  │  ├─ main.py
│  │  ├─ middleware
│  │  │  └─ __init__.py
│  │  ├─ models
│  │  │  ├─ appointment.py
│  │  │  ├─ chat_message.py
│  │  │  ├─ enum.py
│  │  │  ├─ health_metric.py
│  │  │  ├─ medication.py
│  │  │  ├─ medication_reminder.py
│  │  │  ├─ patient_profile.py
│  │  │  ├─ user.py
│  │  │  └─ __init__.py
│  │  ├─ repositories
│  │  │  ├─ appointment_repository.py
│  │  │  ├─ chat_message_repository.py
│  │  │  ├─ health_metric_repository.py
│  │  │  ├─ medication_reminder_repository.py
│  │  │  ├─ medication_repository.py
│  │  │  ├─ profile_repository.py
│  │  │  ├─ user_repository.py
│  │  │  └─ __init__.py
│  │  ├─ schemas
│  │  │  ├─ ai
│  │  │  │  ├─ appointment_context.py
│  │  │  │  ├─ chat.py
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
│  │  │  │  ├─ chat_service.py
│  │  │  │  ├─ context_builder
│  │  │  │  │  ├─ appointment_context_builder.py
│  │  │  │  │  ├─ health_context_builder.py
│  │  │  │  │  ├─ medication_context_builder.py
│  │  │  │  │  ├─ metric_context_builder.py
│  │  │  │  │  └─ patient_context_builder.py
│  │  │  │  ├─ health_context_service.py
│  │  │  │  ├─ health_insight_service.py
│  │  │  │  ├─ prompt
│  │  │  │  │  ├─ chat_prompt_builder.py
│  │  │  │  │  ├─ chat_system_instruction.py
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
│  │  │  ├─ monitoring
│  │  │  │  ├─ health_monitoring_service.py
│  │  │  │  └─ __init__.py
│  │  │  ├─ notification
│  │  │  │  ├─ templates
│  │  │  │  │  ├─ health_insight_template.py
│  │  │  │  │  ├─ medication_reminder_template.py
│  │  │  │  │  └─ __init__.py
│  │  │  │  ├─ template_registry.py
│  │  │  │  └─ __init__.py
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
│  │  │  ├─ base_tool.py
│  │  │  ├─ clinical_knowledge_tool.py
│  │  │  ├─ enum.py
│  │  │  ├─ medication_tool.py
│  │  │  ├─ tool_registry.py
│  │  │  └─ __init__.py
│  │  ├─ utils
│  │  │  └─ __init__.py
│  │  ├─ workers
│  │  │  ├─ health_monitor.py
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
│  │  ├─ app
│  │  │  ├─ providers
│  │  │  │  ├─ AppProviders.tsx
│  │  │  │  └─ QueryProvider.tsx
│  │  │  └─ router
│  │  │     ├─ AppRoutes.tsx
│  │  │     ├─ paths.ts
│  │  │     ├─ ProtectedRoute.tsx
│  │  │     └─ RequireProfile.tsx
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  ├─ components
│  │  │  ├─ layout
│  │  │  │  ├─ AppShell.tsx
│  │  │  │  └─ TopNav.tsx
│  │  │  ├─ primitives
│  │  │  │  ├─ BrandMark.tsx
│  │  │  │  ├─ PillButton.tsx
│  │  │  │  ├─ SelectField.tsx
│  │  │  │  ├─ SurfaceCard.tsx
│  │  │  │  ├─ Tag.tsx
│  │  │  │  └─ TextField.tsx
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
│  │  ├─ config
│  │  │  └─ env.ts
│  │  ├─ features
│  │  │  ├─ appointments
│  │  │  │  ├─ api
│  │  │  │  │  └─ appointmentsApi.ts
│  │  │  │  ├─ appointmentFormSchema.ts
│  │  │  │  ├─ components
│  │  │  │  │  ├─ AppointmentForm.tsx
│  │  │  │  │  ├─ AppointmentList.tsx
│  │  │  │  │  └─ AppointmentRow.tsx
│  │  │  │  ├─ hooks
│  │  │  │  │  ├─ useAppointments.ts
│  │  │  │  │  ├─ useCreateAppointment.ts
│  │  │  │  │  ├─ useDeleteAppointment.ts
│  │  │  │  │  └─ useUpdateAppointment.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ auth
│  │  │  │  ├─ api
│  │  │  │  │  └─ authApi.ts
│  │  │  │  ├─ components
│  │  │  │  │  ├─ LoginForm.tsx
│  │  │  │  │  └─ RegisterForm.tsx
│  │  │  │  ├─ hooks
│  │  │  │  │  ├─ useLogin.ts
│  │  │  │  │  ├─ useRegister.ts
│  │  │  │  │  └─ useSession.ts
│  │  │  │  ├─ tokenStore.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ chat
│  │  │  │  ├─ api
│  │  │  │  │  └─ chatApi.ts
│  │  │  │  ├─ components
│  │  │  │  │  ├─ AssistantTurn.tsx
│  │  │  │  │  ├─ ChatComposer.tsx
│  │  │  │  │  ├─ ChatShell.tsx
│  │  │  │  │  ├─ ChatTranscript.tsx
│  │  │  │  │  ├─ ChatTurn.tsx
│  │  │  │  │  ├─ EntryPointPrompt.tsx
│  │  │  │  │  ├─ NoticeTurn.tsx
│  │  │  │  │  ├─ PendingTurn.tsx
│  │  │  │  │  └─ UserTurn.tsx
│  │  │  │  ├─ hooks
│  │  │  │  │  └─ useSendChatMessage.ts
│  │  │  │  ├─ registry
│  │  │  │  │  └─ entryPoints.ts
│  │  │  │  ├─ store
│  │  │  │  │  └─ useChatSession.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ dashboard
│  │  │  │  ├─ api
│  │  │  │  │  └─ dashboardApi.ts
│  │  │  │  ├─ components
│  │  │  │  │  ├─ MetricSnapshotTile.tsx
│  │  │  │  │  └─ StatTile.tsx
│  │  │  │  ├─ hooks
│  │  │  │  │  ├─ useDashboardAnalytics.ts
│  │  │  │  │  └─ useDashboardOverview.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ health-insight
│  │  │  │  ├─ api
│  │  │  │  │  └─ healthInsightApi.ts
│  │  │  │  ├─ components
│  │  │  │  │  ├─ InsightMessage.tsx
│  │  │  │  │  ├─ InsightSection.tsx
│  │  │  │  │  └─ SeekCareCallout.tsx
│  │  │  │  ├─ hooks
│  │  │  │  │  └─ useGenerateHealthInsight.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ health-metrics
│  │  │  │  ├─ api
│  │  │  │  │  └─ healthMetricsApi.ts
│  │  │  │  ├─ components
│  │  │  │  │  ├─ MetricChart.tsx
│  │  │  │  │  ├─ MetricEditForm.tsx
│  │  │  │  │  ├─ MetricLogForm.tsx
│  │  │  │  │  ├─ MetricLogTable.tsx
│  │  │  │  │  └─ MetricTypeCard.tsx
│  │  │  │  ├─ hooks
│  │  │  │  │  ├─ useDeleteMetric.ts
│  │  │  │  │  ├─ useHealthMetrics.ts
│  │  │  │  │  ├─ useLogMetric.ts
│  │  │  │  │  └─ useUpdateMetric.ts
│  │  │  │  ├─ metricFormSchema.ts
│  │  │  │  ├─ metricIcons.ts
│  │  │  │  ├─ metricSeries.ts
│  │  │  │  └─ types.ts
│  │  │  ├─ medications
│  │  │  │  ├─ api
│  │  │  │  │  ├─ medicationRemindersApi.ts
│  │  │  │  │  └─ medicationsApi.ts
│  │  │  │  ├─ components
│  │  │  │  │  ├─ MedicationForm.tsx
│  │  │  │  │  ├─ MedicationList.tsx
│  │  │  │  │  ├─ MedicationRow.tsx
│  │  │  │  │  ├─ ReminderPanel.tsx
│  │  │  │  │  └─ UnitSelect.tsx
│  │  │  │  ├─ hooks
│  │  │  │  │  ├─ useCreateMedication.ts
│  │  │  │  │  ├─ useCreateMedicationReminder.ts
│  │  │  │  │  ├─ useDeleteMedication.ts
│  │  │  │  │  ├─ useDeleteMedicationReminder.ts
│  │  │  │  │  ├─ useMedicationReminders.ts
│  │  │  │  │  ├─ useMedications.ts
│  │  │  │  │  ├─ useUpdateMedication.ts
│  │  │  │  │  └─ useUpdateMedicationReminder.ts
│  │  │  │  ├─ medicationFormSchema.ts
│  │  │  │  ├─ medicationIcons.tsx
│  │  │  │  └─ types.ts
│  │  │  └─ profile
│  │  │     ├─ api
│  │  │     │  └─ profileApi.ts
│  │  │     ├─ components
│  │  │     │  ├─ ProfileEditForm.tsx
│  │  │     │  ├─ ProfileFields.tsx
│  │  │     │  └─ ProfileForm.tsx
│  │  │     ├─ hooks
│  │  │     │  ├─ useCreateProfile.ts
│  │  │     │  ├─ useProfile.ts
│  │  │     │  └─ useUpdateProfile.ts
│  │  │     ├─ profileFormSchema.ts
│  │  │     └─ types.ts
│  │  ├─ hooks
│  │  │  ├─ use-mobile.ts
│  │  │  ├─ useAutoScroll.ts
│  │  │  └─ useElapsedSeconds.ts
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  ├─ dates.ts
│  │  │  ├─ http.ts
│  │  │  └─ utils.ts
│  │  ├─ main.tsx
│  │  ├─ styles
│  │  │  ├─ theme.css
│  │  │  └─ typography.css
│  │  ├─ types
│  │  └─ views
│  │     ├─ AppointmentsView.tsx
│  │     ├─ ChatView.tsx
│  │     ├─ DashboardView.tsx
│  │     ├─ MedicationsView.tsx
│  │     ├─ MetricsView.tsx
│  │     ├─ ProfileSetupView.tsx
│  │     ├─ ProfileView.tsx
│  │     ├─ SignInView.tsx
│  │     ├─ SignUpView.tsx
│  │     └─ TrendsView.tsx
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  ├─ vercel.json
│  └─ vite.config.ts
├─ README.md
└─ scripts

```