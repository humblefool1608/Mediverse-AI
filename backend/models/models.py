from backend.app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(10), nullable=False)
    phone = db.Column(db.String(15))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    doctor_name = db.Column(db.String(100))
    department = db.Column(db.String(100))
    scheduled_at = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='pending')

class MedicalRecord(db.Model):
    __tablename__ = 'medical_records'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    diagnosis = db.Column(db.Text)
    prescriptions = db.Column(db.Text)
    lab_results = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Billing(db.Model):
    __tablename__ = 'billing'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'))
    amount = db.Column(db.Numeric(10, 2))
    discount_applied = db.Column(db.Boolean, default=False)
    insurance_scheme = db.Column(db.String(100))
    qr_code_url = db.Column(db.Text)
    paid = db.Column(db.Boolean, default=False)

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    message = db.Column(db.Text)
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)

class BedAvailability(db.Model):
    __tablename__ = 'bed_availability'
    id = db.Column(db.Integer, primary_key=True)
    ward_name = db.Column(db.String(50))
    total_beds = db.Column(db.Integer)
    occupied_beds = db.Column(db.Integer)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
