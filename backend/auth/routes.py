from flask import Blueprint, request, jsonify
from backend.app import db, User
from auth.utils import hash_password, verify_password, generate_token

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    full_name = data.get('full_name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    role = data.get('role', 'patient')
    if role not in ['admin', 'patient']:
        return jsonify({'error': 'Invalid role'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400
    password_hash = hash_password(password)
    user = User(full_name=full_name, email=email, phone=phone, password_hash=password_hash, role=role)
    db.session.add(user)
    db.session.commit()
    token = generate_token(user)
    return jsonify({'message': 'User created', 'token': token})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(password, user.password_hash):
        return jsonify({'error': 'Invalid email or password'}), 401
    token = generate_token(user)
    return jsonify({'message': 'Logged in', 'token': token, 'role': user.role})
