from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # This enables CORS for all domains

# MySQL database connection
db = mysql.connector.connect(
    host="localhost",
    user="root",  # Replace with your MySQL username
    password="nandan@2025",  # Replace with your MySQL password
    database="mediverse_auth"  # Replace with your database name
)

# Function to check if the user exists in the database
def user_exists(user):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (user,))
    return cursor.fetchone()

# Function to create a new user
def create_user(user, name, email, mobile, password):
    hashed_password = generate_password_hash(password)
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO users (username, name, email, mobile, password) VALUES (%s, %s, %s, %s, %s)",
        (user, name, email, mobile, hashed_password),
    )
    db.commit()

# Function to authenticate the user
def authenticate_user(user, password):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (user,))
    result = cursor.fetchone()
    if result and check_password_hash(result['password'], password):
        return result
    return None

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    user = data.get('user')
    name = data.get('name')
    email = data.get('email')
    mobile = data.get('mobile')
    password = data.get('password')

    # Check if the user already exists
    if user_exists(user):
        return jsonify({"message": "User already exists!"}), 400

    # Create a new user
    create_user(user, name, email, mobile, password)
    return jsonify({"message": "User created successfully!"}), 201

@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    user = data.get('user')
    password = data.get('password')

    # Authenticate the user
    user_data = authenticate_user(user, password)
    if not user_data:
        return jsonify({"message": "Invalid username or password!"}), 401

    # Successful login
    return jsonify({
        "message": "Signed in successfully!",
        "role": user_data['role']  # Assuming you have a 'role' column in your 'users' table
    }), 200

@app.route('/dashboard', methods=['GET'])
def dashboard():
    role = request.args.get('role')  # Or use authentication headers, etc.

    if role == 'admin':
        return jsonify({"message": "Welcome, Admin!"}), 200
    elif role == 'user':
        return jsonify({"message": "Welcome, User!"}), 200
    else:
        return jsonify({"message": "Unauthorized access!"}), 403

if __name__ == "__main__":
    app.run(debug=True)
