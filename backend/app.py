import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Import image processing module
from image_processing.processing import process_image

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure the database from the .env file
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define the User data model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    date_of_birth = db.Column(db.String(10), nullable=False)
    university = db.Column(db.String(120), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    photo = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# API endpoint for registration
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json

    # Image processing logic remains the same
    photo_base64 = data.get('photo')
    if not photo_base64:
        return jsonify({'error': 'Photo data is required.'}), 400

    try:
        processed_photo_base64 = process_image(photo_base64)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

    # Save to the new PostgreSQL database using the SQLAlchemy model
    try:
        new_user = User(
            full_name=data.get('fullName'),
            email=data.get('email'),
            phone_number=data.get('phoneNumber'),
            date_of_birth=data.get('dateOfBirth'),
            university=data.get('university'),
            gender=data.get('gender'),
            photo=processed_photo_base64
        )
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'message': 'Registration successful'}), 200
    except Exception as e:
        db.session.rollback() # Rollback on error
        return jsonify({'error': 'Database error: ' + str(e)}), 500

if __name__ == '__main__':
    # This creates the tables based on your `User` model
    with app.app_context():
        db.create_all()
    app.run(port=5000, debug=True)
