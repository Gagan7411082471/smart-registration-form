import base64
import cv2
import numpy as np

# Load the pre-trained Haar Cascade classifier for face detection
# Download from: https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/haarcascade_frontalface_default.xml
# Place this file in the 'backend' folder
try:
    face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
except Exception as e:
    raise RuntimeError("Haar cascade file not found. Please download it and place it in the backend folder.")

def process_image(photo_base64: str) -> str:
    """
    Decodes a Base64 image, processes it to detect a face, crops and resizes it to 250x250 pixels,
    and then re-encodes it back to a Base64 string.
    
    Args:
        photo_base64 (str): The Base64 string of the image, possibly with a data URI header.
        
    Returns:
        str: The Base64 string of the processed 250x250 image.
        
    Raises:
        ValueError: If the input data is invalid, no face is detected, or the image can't be processed.
    """
    # 1. Decode Base64 string to an OpenCV image
    try:
        # Split the header from the encoded data (e.g., 'data:image/jpeg;base64,...')
        _header, encoded = photo_base64.split(",", 1)
        img_bytes = base64.b64decode(encoded)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Invalid image data.")
    except (ValueError, IndexError):
        raise ValueError("Invalid Base64 string format. Unable to decode image.")

    # 2. Face Detection and Cropping
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the grayscale image
    # scaleFactor: how much the image size is reduced at each image scale
    # minNeighbors: how many neighbors each candidate rectangle should have
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

    if len(faces) == 0:
        raise ValueError("No face detected in the image.")
    
    # If multiple faces are detected, assume the largest one is the primary
    (x, y, w, h) = sorted(faces, key=lambda f: f[2] * f[3], reverse=True)[0]
    
    # Crop the detected face with some padding for a better visual
    padding = int(0.2 * w)
    x1 = max(0, x - padding)
    y1 = max(0, y - padding)
    x2 = min(image.shape[1], x + w + padding)
    y2 = min(image.shape[0], y + h + padding)
    
    cropped_face = image[y1:y2, x1:x2]

    # 3. Resize the cropped image to a consistent 250x250 pixels
    resized_image = cv2.resize(cropped_face, (250, 250), interpolation=cv2.INTER_AREA)

    # 4. Re-encode the processed image back to Base64
    _, buffer = cv2.imencode('.jpg', resized_image, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    processed_photo_base64 = base64.b64encode(buffer).decode('utf-8')

    return "data:image/jpeg;base64," + processed_photo_base64
