# Winter Break 2023 Project

### Todo

- Include `creds.json` in `.gitignore` and remove from commit history
- Backup database

### Running website locally

> [!NOTE]
> Make sure you're inside the root directory of the project first.

```bash
cd website
npm install
npm install -g nodemon
nodemon .
```

### API Endpoints

| Method | Endpoint          | Description                                                                     | Required Data                                           |
| ------ | ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `POST` | `/members`        | Register a new member into database.                                            | `psid`, `email`, `password`, `first`, `last`, `discord` |
| `GET`  | `/members`        | Retrieve all registered members along with their details.                       |                                                         |
| `GET`  | `/members/:psid?` | Find a registered member with a specific PSID along with their details.         |                                                         |
|        |                   |                                                                                 |                                                         |
| `POST` | `/log`            | Insert a log by PSID into database. Note: member must be registered beforehand. | `psid`                                                  |
| `GET`  | `/log`            | Retrieve all logs stored.                                                       |                                                         |
| `GET`  | `/log/:psid?`     | Retrieve all logs stored with a specific PSID.                                  |                                                         |

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

# Log a member
requests.post(
    "http://localhost:8000/api/log",
    data={"psid": 1234567},
)

# Retreive all logs
r = requests.get("http://localhost:8000/api/log")
pprint(r.json())
```
