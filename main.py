import requests

requests.post(
    "http://localhost:8000/post",
    data={
        "psid": 92834723,
        "email": "python@email.com",
        "password": "password",
        "first": "Python",
        "last": "Lang",
        "discord": "Python#1234",
    },
)
