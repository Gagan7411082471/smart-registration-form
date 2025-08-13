# User Registration with Image Validation

Welcome to the User Registration with Image Validation project\! This is a multi-step web application that allows users to register their details and submit a photo. The backend automatically processes and standardizes the photo using OpenCV before storing it, ensuring data consistency for future use.

-----

### 🚀 Features

  * **Multi-Step Frontend Form**: A modern, responsive React form for a smooth user experience.
  * **Image Capture & Upload**: Users can either upload a photo from their device or capture one using their webcam.
  * **Automated Image Processing**: The Python backend validates the image, detects and crops the face, and resizes it to a standardized 250x250 pixels.
  * **Secure Data Storage**: User data and the processed image are securely stored in a scalable cloud-hosted PostgreSQL database.
  * **Full-Stack Integration**: Seamless communication between the React frontend and the Flask backend using REST API.

-----

### 💻 Technologies

  * **Frontend**: React, Next.js, Zod, Shadcn/ui
  * **Backend**: Python, Flask, Flask-CORS, Flask-SQLAlchemy, OpenCV, python-dotenv
  * **Database**: PostgreSQL (e.g., Neon)

-----

### 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

  * **Node.js & npm**
  * **Python 3.x**
  * **Git**
  * A **PostgreSQL database connection string** (e.g., from Neon.tech).

-----

### ⚙️ Installation and Setup

Follow these steps to get the project running on your local machine.

#### 1\. Clone the Repository

```bash
git clone <repository-url>
cd <project-root>
```

#### 2\. Backend Setup

1.  Navigate to the `backend` directory.
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment (recommended).
    ```bash
    python -m venv venv
    # On Windows:
    venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```
3.  Install the required Python packages.
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the `backend` directory and add your database connection string. Replace the placeholder with your actual connection string from Neon.
    ```text
    DATABASE_URL="postgresql://user:password@host/dbname"
    ```
5.  Download the Haar Cascade file for face detection and place it in the `backend` directory.
    ```bash
    curl -O https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml
    ```

#### 3\. Frontend Setup

1.  Navigate back to the project's root directory.
    ```bash
    cd ..
    ```
2.  Install the Node.js dependencies.
    ```bash
    npm install
    ```

-----

### ▶️ Running the Project

You need to run the frontend and backend servers in separate terminal windows.

#### 1\. Start the Backend

Open a terminal, navigate to the `backend` directory, and run the Flask server.

```bash
cd backend
python app.py
```

The server will start on `http://localhost:5000`.

#### 2\. Start the Frontend

Open a **new terminal**, navigate to the project root directory, and run the Next.js development server.

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

-----

### 📂 Project Structure

```
.
├── backend/
│   ├── app.py             # Main Flask application
│   ├── .env               # Environment variables
│   ├── requirements.txt   # Python dependencies
│   ├── haarcascade...xml  # OpenCV face detection model
│   ├── db/
│   │   └── users.db       # SQLite database file (legacy)
│   ├── image_processing/
│   │   └── processing.py  # OpenCV logic
│
├── src/
│   ├── components/
│   │   └── registration/
│   │       ├── FormStep.jsx
│   │       ├── ConfirmationStep.jsx
│   │       └── ...
└── package.json
```
