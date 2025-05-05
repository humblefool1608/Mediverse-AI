from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from auth.routes import auth_bp
import os

app = Flask(__name__)
CORS(app)

# Configuration - for demo purpose using sqlite, replace with PostgreSQL/MySQL as needed
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'hospital.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a strong secret in production

db = SQLAlchemy(app)

# Import models here to register with SQLAlchemy
from models.models import User, Appointment, MedicalRecord, Billing, Notification, BedAvailability

# Create tables
with app.app_context():
    db.create_all()

# Register auth blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

# Routes - Dashboard, appointments, records, billing, notifications, bed_status, chatbot
from flask import request, jsonify
from auth.utils import token_required, get_jwt_identity
from sqlalchemy import and_
from datetime import datetime

@app.route('/dashboard', methods=['GET'])
@token_required
def dashboard(current_user):
    if current_user.role == 'admin':
        return jsonify({'message': f'Welcome Admin {current_user.full_name}'})
    else:
        return jsonify({'message': f'Welcome Patient {current_user.full_name}'})

@app.route('/appointments', methods=['GET', 'POST'])
@token_required
def appointments(current_user):
    if request.method == 'GET':
        if current_user.role == 'admin':
            # Admin: return all appointments
            appts = Appointment.query.all()
        else:
            # Patient: return only their appointments
            appts = Appointment.query.filter_by(user_id=current_user.id).all()
        result = []
        for a in appts:
            result.append({
                'id': a.id,
                'doctor_name': a.doctor_name,
                'department': a.department,
                'scheduled_at': a.scheduled_at.isoformat() if a.scheduled_at else None,
                'status': a.status
            })
        return jsonify(result)
    elif request.method == 'POST':
        if current_user.role != 'patient':
            return jsonify({'error': 'Only patients can book appointments'}), 403
        data = request.json
        doctor_name = data.get('doctor_name')
        department = data.get('department')
        scheduled_at_str = data.get('scheduled_at')
        try:
            scheduled_at = datetime.fromisoformat(scheduled_at_str)
        except Exception:
            return jsonify({'error': 'Invalid date format'}), 400
        new_appt = Appointment(user_id=current_user.id, doctor_name=doctor_name,
                               department=department, scheduled_at=scheduled_at)
        db.session.add(new_appt)
        db.session.commit()
        return jsonify({'message': 'Appointment booked', 'appointment_id': new_appt.id}), 201

@app.route('/records', methods=['GET'])
@token_required
def records(current_user):
    if current_user.role == 'admin':
        records = MedicalRecord.query.all()
    else:
        records = MedicalRecord.query.filter_by(user_id=current_user.id).all()
    result = []
    for r in records:
        result.append({
            'id': r.id,
            'diagnosis': r.diagnosis,
            'prescriptions': r.prescriptions,
            'lab_results': r.lab_results,
            'created_at': r.created_at.isoformat()
        })
    return jsonify(result)

@app.route('/billing', methods=['GET'])
@token_required
def billing(current_user):
    if current_user.role == 'admin':
        bills = Billing.query.all()
    else:
        bills = Billing.query.filter_by(user_id=current_user.id).all()
    result = []
    for b in bills:
        result.append({
            'id': b.id,
            'appointment_id': b.appointment_id,
            'amount': float(b.amount),
            'discount_applied': b.discount_applied,
            'insurance_scheme': b.insurance_scheme,
            'qr_code_url': b.qr_code_url,
            'paid': b.paid
        })
    return jsonify(result)

@app.route('/notifications', methods=['GET'])
@token_required
def notifications(current_user):
    notes = Notification.query.filter_by(user_id=current_user.id).order_by(Notification.sent_at.desc()).all()
    result = []
    for n in notes:
        result.append({
            'message': n.message,
            'sent_at': n.sent_at.isoformat()
        })
    return jsonify(result)

@app.route('/bed-status', methods=['GET'])
@token_required
def bed_status(current_user):
    beds = BedAvailability.query.all()
    result = []
    for b in beds:
        result.append({
            'ward_name': b.ward_name,
            'total_beds': b.total_beds,
            'occupied_beds': b.occupied_beds,
            'last_updated': b.last_updated.isoformat()
        })
    return jsonify(result)

@app.route('/chatbot', methods=['POST'])
@token_required
def chatbot(current_user):
    # For demo, returns simple echo message - replace with actual chatbot logic
    data = request.json
    question = data.get('question', '')
    response = f"You asked: {question}. For assistance, contact your hospital."
    return jsonify({'answer': response})

if __name__ == '__main__':
    app.run(debug=True)
