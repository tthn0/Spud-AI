<div align="center">
  <picture>
    <source
      width=150
      media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
      srcset="images/logos/ion_logo_dark.jpg"
    />
    <source
      width=150
      media="(prefers-color-scheme: dark)"
      srcset="images/logos/ion_logo_light.jpg"
    />
    <img alt="Logo">
  </picture>
  <h1>
      Winter Break 2023 Project
  </h1>
  <p>
    This repository contains the source code for The Ion's automatic facial detection + recognition bot named Spud! As soon as someone walks into the room, our bot will log that into our database, and we're able to see that in real time through a user-friendly interface on our website.
  </p>
</div>

## 📋 Todo

- Finalize `README.md`.
- Include `creds.json` in `.gitignore` and remove from commit history.
- Reset commits + branches after merging.

## 📸 Screenshots

[Add images of the actual, finalized website here].

## 🌀 About

### Who We Are

We are a group of undergraduates studying at University of Houston (Go Coogs!) that want to apply our various skills to create an awesome project! Our goal was to combine web development, embedded systems, robotics, and AI into one large project and expand our working knowledge.

| <img width=150 src="images/people/thomas.jpg"> | <img width=150 src="images/people/khanh.jpg"> | <img width=150 src="images/people/diana.jpg"> |
| :--------------------------------------------: | :-------------------------------------------: | :-------------------------------------------: |
|                   **Thomas**                   |                   **Khanh**                   |                   **Diana**                   |
|                   (Back End)                   |                  (Front End)                  |             (Facial Recognition)              |

| <img width=150 src="images/people/matthew.jpg"> | <img width=150 src="images/people/sebastian.jpg"> | <img width=150 src="images/people/placeholder.jpg"> |
| :---------------------------------------------: | :-----------------------------------------------: | :-------------------------------------------------: |
|                   **Matthew**                   |                   **Sebastian**                   |                     **Someone**                     |
|               (Facial Detection)                |                 (Docker/Database)                 |                       (Role)                        |

## 🛠️ Tools & Technologies

- **Web**: Node.JS, Express.JS, Google Cloud Platform.
- **Database**: MySQL.
- **AI**: Python, OpenCV.
- **Physical**: Jetson Nano, ESP32.

## 💻 Running Website Locally

> [!IMPORTANT]
> Make sure you're inside the root directory of the project first.

```bash
cd website              # Move into the website folder
npm install             # Install all required packages locally
npm install -g nodemon  # Install nodemon globally (for hot reloading)
nodemon .               # Run the website
```

## 📡 API Documentation

### Conventions

> [!NOTE]
>
> - Colon means variable.
> - Question mark means optional.

### Members

| Method | Endpoint              | Description                                                             | Required Payload Data                                   |
| :----- | :-------------------- | :---------------------------------------------------------------------- | :------------------------------------------------------ |
| `GET`  | `/api/members`        | Retrieve all registered members along with their details.               |                                                         |
| `GET`  | `/api/members/:psid?` | Find a registered member with a specific PSID along with their details. |                                                         |
| `POST` | `/api/members`        | Register a new member into database.                                    | `psid`, `email`, `password`, `first`, `last`, `discord` |

### Log

| Method   | Endpoint          | Description                                                                     | Required Payload Data |
| :------- | :---------------- | :------------------------------------------------------------------------------ | :-------------------- |
| `GET`    | `/api/log`        | Retrieve all logs stored.                                                       |                       |
| `GET`    | `/api/log/:psid?` | Retrieve all logs stored with a specific PSID.                                  |                       |
| `POST`   | `/api/log`        | Insert a log by PSID into database. Note: member must be registered beforehand. | `psid`                |
| `DELETE` | `/api/log/:id`    | Delete a log by its log ID (not PSID).                                          |                       |

### Example API Usage

```python
from pprint import pprint
import requests

# Register new member
requests.post(
    "http://localhost:8000/api/members",
    data={
        "psid": 1234567,
        "email": "test@user.com",
        "password": "password",
        "first": "Test",
        "last": "User",
        "discord": "test_user",
    },
)

# Find member with a PSID of 1234567
r = requests.get("http://localhost:8000/api/members/1234567")
pprint(r.json())

# Log a member with a PSID of 1234567
requests.post(
    "http://localhost:8000/api/log",
    data={"psid": 1234567},
)

# Retreive all logs
r = requests.get("http://localhost:8000/api/log")
pprint(r.json())

# Delete a log with an ID of 20
requests.delete("http://localhost:8000/api/log/20")
```

## 🚀 Future Plans

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

- Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
- Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
