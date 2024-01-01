import cv2
import mediapipe as mp
import time
import face_recognition

# Initialize MediaPipe Face Mesh.
mp_drawing = mp.solutions.drawing_utils
mp_face_mesh = mp.solutions.face_mesh
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)

# Initialize webcam.
cap = cv2.VideoCapture(0)


seb = face_recognition.load_image_file("./seb.jpg")
seb_face_encoding = face_recognition.face_encodings(seb)[0]

matt = face_recognition.load_image_file("./matt.jpg")
matt_face_encoding = face_recognition.face_encodings(matt)[0]


# Create arrays of known face encodings and their names
known_face_encodings = [
    seb_face_encoding,
    matt_face_encoding,


]
known_face_names = [
    "Seb",
    "Matt",
]


with mp_face_mesh.FaceMesh(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5) as face_mesh:

    while cap.isOpened():
        success, image = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            continue

        start = time.time()

        # Convert the BGR image to RGB and process with MediaPipe.
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False
        results = face_mesh.process(image_rgb)

        # Convert back to BGR for OpenCV.
        image_rgb.flags.writeable = True
        image = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)

        # Face recognition.
        face_locations = face_recognition.face_locations(image_rgb)
        face_encodings = face_recognition.face_encodings(image_rgb, face_locations)

        for face_encoding, face_location in zip(face_encodings, face_locations):
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

            if True in matches:
                first_match_index = matches.index(True)
                name = known_face_names[first_match_index]

            # Draw a box and label for each face.
            top, right, bottom, left = face_location
            cv2.rectangle(image, (left, top), (right, bottom), (0, 0, 255), 2)
            cv2.putText(image, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 1)

        # Draw the face mesh annotations.
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                mp_drawing.draw_landmarks(
                    image=image,
                    landmark_list=face_landmarks,
                    connections=mp_face_mesh.FACEMESH_TESSELATION,
                    landmark_drawing_spec=drawing_spec,
                    connection_drawing_spec=drawing_spec)

        # Calculate FPS.
        end = time.time()
        fps = 1 / (end - start)
        cv2.putText(image, f'FPS: {int(fps)}', (20, 70), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 2)

        # Display the image.
        cv2.imshow('MediaPipe FaceMesh', image)

        if cv2.waitKey(5) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()
