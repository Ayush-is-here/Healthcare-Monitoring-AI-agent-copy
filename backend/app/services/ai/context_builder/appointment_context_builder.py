from app.models.appointment import Appointment
from app.schemas.ai.appointment_context import AppointmentContext
from datetime import date, time


class AppointmentContextBuilder:

    @staticmethod
    def build(
        appointment: Appointment
    ) -> AppointmentContext:

        return AppointmentContext(
            doctor_name=appointment.doctor_name,
            appointment_date=appointment.appointment_date,
            appointment_time=appointment.appointment_time,
            purpose=appointment.purpose,
            location=appointment.location,
            notes=appointment.notes,
            status=appointment.status
        )