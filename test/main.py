import requests

requests.post(
    # "http://172.20.32.119:8000/post",
    "http://localhost:8000/post",
    data={
        "psid": 92834723,
        "email": "localhost@email.com",
        "password": "password",
        "first": "hi",
        "last": "hi",
        "discord": "hi",
    },
)
