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
