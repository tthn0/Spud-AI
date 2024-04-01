<div align="center">
  <img src="Images/Logos/SVG/Houston Robotics Group.svg" width=125 alt="Logo">
  <h1>
      Spud AI
  </h1>
  <p>
    This repository contains the source code for <a href="https://houstonroboticsgroup.com">Houston Robotics Group</a>'s real-time, automatic facial detection + recognition bot named Spud! Also featured in this repo is the accompanying dashboard website for our bot. This fusion of web development, AI, and physical computing delivers an innovative solution for seamless member tracking. As soon as someone walks into the room, our bot will log that into our database, and we're able to see that through a user-friendly interface on our website! 
  </p>
</div>

# 📋 Todo (Temporary)

- Implement logging.
  - Include IP, requested endpoint, headers, body, params.
- API authentication:
  - Add header token check for sensitive endpoints.
  - Maybe allow all internal requests from server's IP.
    - A better way would be to include an auth token for every internal request.
    - Store tokens in new database table.
  - Update documentation.
  - Add site's IP to GitHub's about section.
- Merging Khanh's branch:
  - Consolidate views/partials:
    - Navbar partial.
    - Favicon partial + theme colors partial.
  - POST `/api/users` for form action.
  - Remove password & PSID fields.
  - Mark inputs as reqiured + make sure input types are correct.
- Finalize repo:
  - Add screenshots.
  - Add a video demo.
  - Compress all images/videos.
  - Delete this todo section once all other todos have been completed.

# 📸 Screenshots

[Add images of the actual, finalized website here]

# 🎬 Video Demo

[Add a quick video showing how our project works]

# 🌀 About

### Who We Are

We are a group of undergraduates studying at University of Houston (Go Coogs!) that want to apply our various skills to create an awesome project! Our goal was to combine web development, embedded systems, robotics, and AI into one large project and expand our working knowledge.

| <img width=150 src="Images/People/Thomas.jpg"> | <img width=150 src="Images/People/Khanh.jpg"> | <img width=150 src="Images/People/Diana.jpg"> |
| :--------------------------------------------: | :-------------------------------------------: | :-------------------------------------------: |
|                   **Thomas**                   |                   **Khanh**                   |                   **Diana**                   |
|                  (Full Stack)                  |                  (Front End)                  |             (Facial Recognition)              |

| <img width=150 src="Images/People/Matthew.jpg"> | <img width=150 src="Images/People/Sebastian.jpg"> | <img width=150 src="Images/People/Sagun.jpg"> |
| :---------------------------------------------: | :-----------------------------------------------: | :-------------------------------------------: |
|                   **Matthew**                   |                   **Sebastian**                   |                   **Sagun**                   |
|               (Facial Detection)                |                  (Docker/Cloud)                   |                  (AI Mentor)                  |

# 🛠️ Tools & Technologies

- **Web**: Node.JS, Express.JS, Socket.io, Google Cloud Platform.
- **Database**: MySQL.
- **AI**: Python, OpenCV.
- **Physical**: Jetson Nano, Raspberry Pi Camera Module 2.

# 🚏 Frontend Routes

- `/`: Landing page.
- `/register`: Registration page.
- `/logs`: Logs page.
  - Updates in real time using sockets.
  - Responsive.
  - Searchable:
    - `⌘ + F` / `Ctrl + F` shortcut.
    - Includes text highlighting.
  - Sortable.
  - Exportable.
  - Allows for the adjustment of the number of logs displayed.
  - Logs are deleteable (with an animation).
  - Has a skeleton loader when fetching data.
- `/testlogs`: Logs page supplemented with fake data.

> [!CAUTION]
> Every time the real logs are updated through the API, it triggers an update to all connected clients and forces them to re-query the API to to retrieve the newly updated logs. Since fake logs are randomly generated non-deterministically, it causes the unintended side effect of loading in new fake data which can override the previous data in the table for clients that are viewing `/testlogs`.

# 📡 API Documentation

### Conventions

> [!NOTE]
>
> - A colon indicates a variable field.
> - A question mark indicates an optional variable.

### Users Endpoints

| Method | Endpoint         | Description                                                                                            | Required Data                       |
| :----- | :--------------- | :----------------------------------------------------------------------------------------------------- | :---------------------------------- |
| `GET`  | `/api/testusers` | Retrieve all registered users' details and supplement with additional fake users for testing purposes. |                                     |
| `GET`  | `/api/users`     | Retrieve all registered users' details.                                                                |                                     |
| `POST` | `/api/users`     | Register a new user into database.                                                                     | `email`, `first`, `last`, `discord` |

### Logs Endpoints

| Method   | Endpoint            | Description                                                                                                                                                                      |
| :------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/testlogs`     | Retrieve all logs entries and supplement with fake logs for testing purposes. Timestamps of the fake logs are guarenteed to be older than the oldest timestamp of the real data. |
| `GET`    | `/api/logs/`        | Retrieve all logs entires.                                                                                                                                                       |
| `POST`   | `/api/logs/:userId` | Insert a log entry by a user ID (user must be registered beforehand).                                                                                                            |
| `DELETE` | `/api/logs/:logId`  | Delete a log entry by its log ID (**not** user ID).                                                                                                                              |

<details>
  <summary>
    <h3>API Examples (cURL)</h3>
  </summary>

```bash
# Get test users
curl -X GET "http://localhost:8000/api/testusers"

# Get actual registered users
curl -X GET "http://localhost:8000/api/users"

# Register a new user
curl -X POST "http://localhost:8000/api/users" \
     -d "email=example@email.com" \
     -d "first=First" \
     -d "last=Last" \
     -d "discord=discord"

# Get test log entries
curl -X GET "http://localhost:8000/api/testlogs"

# Get all actual log entries
curl -X GET "http://localhost:8000/api/logs"

# Log a new entry for the user whose ID is 0
curl -X POST "http://localhost:8000/api/logs/0"

# Delete a log entry with an ID of 0
curl -X DELETE "http://localhost:8000/api/logs/0"
```

</details>

<details>
  <summary>
    <h3>API Examples (Python)</h3>
  </summary>

```python
import requests
from pprint import pprint

BASE_ENDPOINT = "http://localhost:8000/api"

# Get test users
r = requests.get(f"{BASE_ENDPOINT}/testusers")
pprint(r.json())

# Get actual registered users
r = requests.get(f"{BASE_ENDPOINT}/users")
pprint(r.json())

# Register a new user
r = requests.post(
    f"{BASE_ENDPOINT}/users",
    data={
        "email": "example@email.com",
        "first": "First",
        "last": "Last",
        "discord": "discord",
    },
)
pprint(r.json())

# Get test log entries
r = requests.get(f"{BASE_ENDPOINT}/testlogs")
pprint(r.json())

# Get all actual log entries
r = requests.get(f"{BASE_ENDPOINT}/logs")
pprint(r.json())

# Log a new entry for the user whose ID is 0
r = requests.post(f"{BASE_ENDPOINT}/logs/{0}")
pprint(r.json())

# Delete a log entry with an ID of 0
r = requests.delete(f"{BASE_ENDPOINT}/logs/{0}")
pprint(r.json())
```

</details>

# 💻 Running Website Locally

> [!IMPORTANT]
> Before running the commands below, update the `Source/Website/config/example.env` file with proper configurations and rename it to `.env`.

```bash
cd Source/Website   # Move into the website directory
npm install -y      # Install all dependencies locally
npm start           # Run the website
```

# 💾 Hosting on Linux Server

```bash
sudo apt update
sudo apt upgrade -y
sudo apt autoremove
sudo apt autoclean
sudo apt install -y npm nginx
```

- Install [Node.js](https://nodejs.org/en/download/package-manager).

```bash
git clone https://github.com/tthn0/Spud-AI
cd Spud-AI/Source/Website
npm install
```

- Update the `Source/Website/config/example.env` file with proper configurations and rename it to `.env`.
- Update the nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/Website-Name
```

- Add the following information:

```nginx
server {
    listen 80;
    server_name XXX.XXX.XXX.XXX;

    location / {
        proxy_pass http://localhost:XXXX;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/Website-Name /etc/nginx/sites-enabled/
sudo nginx -t  # Test Nginx configuration
sudo systemctl restart nginx
npm install -g pm2
pm2 start app.js
```

> [!IMPORTANT]
> Make sure ports are open before viewing website.

# 🚀 Future Plans

As we look ahead, our team envisions exciting expansions and enhancements for this project! Our commitment to innovation drives us to explore new features and improvements to elevate functionality. Here are some of the future plans on our roadmap:

- **Enhanced User Interface**: We plan to refine and optimize the user interface for a more seamless and modern experience.
- **Real-time Analytics**: Implementing real-time analytics to provide insights into member activity, trends, and overall system performance.
- **Machine Learning Integration**: Exploring the integration of machine learning algorithms to enhance facial recognition accuracy and adaptability.
- **Mobile Application**: Developing a dedicated mobile application for on-the-go access to member logs, notifications, and system controls.
- **Security Enhancements**: Continuously improving security measures to ensure the integrity of member data and our servers.

These plans reflect our ongoing commitment to pushing the boundaries of technology and delivering a robust and cutting-edge solution. Stay tuned for exciting updates as we evolve Spud into an even more powerful and feature-rich robot!
