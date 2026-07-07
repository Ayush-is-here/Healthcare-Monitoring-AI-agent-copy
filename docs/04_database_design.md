Entity Relationship Diagram (v1.1)
┌──────────────────────┐
│        USER          │
├──────────────────────┤
│ PK id (UUID)         │
│ full_name            │
│ email                │
│ password_hash        │
│ role                 │
│ phone                │
│ is_active            │
│ is_verified          │
│ created_at           │
│ updated_at           │
└──────────┬───────────┘
           │1
           │
           │
           │1
┌──────────▼───────────┐
│   HEALTH_PROFILE     │
├──────────────────────┤
│ PK id                │
│ FK user_id           │
│ date_of_birth        │
│ gender               │
│ blood_group          │
│ height_cm            │
│ allergies            │
│ chronic_conditions   │
│ emergency_contact    │
│ created_at           │
│ updated_at           │
└──────────┬───────────┘
           │
           │1
           │
           │N
┌──────────▼────────────┐
│    HEALTH_METRIC      │
├───────────────────────┤
│ PK id                 │
│ FK user_id            │
│ metric_type           │
│ numeric_value         │
│ text_value            │
│ json_value            │
│ unit                  │
│ source                │
│ recorded_at           │
│ created_at            │
└───────────────────────┘


USER
 │
 ├───────────────< MEDICATION
 │                     │
 │                     │1
 │                     │
 │                     ▼
 │             MEDICATION_SCHEDULE
 │                     │
 │                     │1
 │                     │
 │                     ▼
 │               MEDICATION_LOG
 │
 ├───────────────< HEALTH_REPORT
 │                      │
 │                      │1
 │                      │
 │                      ▼
 │                REPORT_SECTION
 │
 ├───────────────< AI_CONVERSATION
 │                       │
 │                       │1
 │                       │
 │                       ▼
 │                    MESSAGE
 │
 ├───────────────< AI_INSIGHT
 │
 ├───────────────< NOTIFICATION
 │
 └───────────────< EXTERNAL_CONNECTION

 Cardinality
 | Relationship                       | Type  |
| ---------------------------------- | ----- |
| User → HealthProfile               | 1 : 1 |
| User → HealthMetric                | 1 : N |
| User → Medication                  | 1 : N |
| Medication → MedicationSchedule    | 1 : N |
| MedicationSchedule → MedicationLog | 1 : N |
| User → HealthReport                | 1 : N |
| HealthReport → ReportSection       | 1 : N |
| User → AIConversation              | 1 : N |
| AIConversation → Message           | 1 : N |
| User → AIInsight                   | 1 : N |
| User → Notification                | 1 : N |
| User → ExternalConnection          | 1 : N |




Core Tables
USER

Stores:

Authentication
Roles
Account Information
HEALTH_PROFILE

Stores:

Demographics
Blood Group
Height
Allergies
Chronic Diseases
Emergency Contacts

Note: Dynamic health data like weight, blood pressure, sleep, etc. are not stored here.

HEALTH_METRIC

Stores every health metric in a scalable time-series format.

Examples:

Blood Pressure
Heart Rate
Blood Sugar
Sleep
Steps
Calories
Weight
SpO₂
Temperature

Uses:

numeric_value
text_value
json_value

to support different metric types efficiently.

MEDICATION

Stores medication information.

Fields include:

Medicine name
Dosage
Form
Purpose
Prescribed By
Start Date
End Date
Notes
MEDICATION_SCHEDULE

Stores:

Reminder Time
Frequency
Days of Week
Reminder Enabled
Status
Dosage Override
MEDICATION_LOG

Stores actual medication events.

Fields:

id
schedule_id
scheduled_time
taken_at
status (Taken / Missed / Skipped)
notes
created_at

Used for:

Medication adherence
Missed dose tracking
AI analysis
Weekly reports
HEALTH_REPORT

AI-generated reports.

Examples:

Daily Report
Weekly Report
Monthly Report

Additional Fields:

report_type
generated_by
generated_at
REPORT_SECTION

Instead of storing one large report, stores structured sections.

Examples:

Summary
Trends
Risks
Recommendations
Medication Adherence

Additional Field:

order_index
AI_CONVERSATION

Represents one chat session.

Additional Fields:

title
started_at
last_message_at
status
MESSAGE

Stores every chat message.

Additional Fields:

sender
content
tokens
created_at
AI_INSIGHT

Stores explainable AI outputs.

Examples:

Blood pressure increased
Sleep quality decreased
Medication adherence dropped

Additional Fields:

confidence
supporting_metrics
severity
NOTIFICATION

Stores:

Medication reminders
Health alerts
Report notifications
AI recommendations

Additional Fields:

priority
scheduled_for
delivered_at
EXTERNAL_CONNECTION

Stores connected external healthcare services.

Examples:

Google Fit
Fitbit
Apple Health
Future EHR

Additional Fields:

provider
access_token (encrypted)
refresh_token (encrypted)
expires_at
status
connected_at
Database Design Principles
✅ Normalized
✅ Extendable
✅ Time-Series Optimized
✅ AI-Friendly
✅ Analytics-Friendly
✅ HL7 FHIR-Ready
✅ Multi-Wearable Support
✅ Medication Adherence Tracking
✅ Explainable AI Ready
✅ PostgreSQL Optimized
✅ Production Scalable
Future Infrastructure Models (Phase 2)

These are not part of the MVP but are planned for production-grade expansion.

RefreshToken
AuditLog
FileUpload
BackgroundJob
APIKey