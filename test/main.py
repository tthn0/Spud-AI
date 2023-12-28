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
