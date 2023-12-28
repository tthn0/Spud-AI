from pprint import pprint
import requests

# r = requests.post(
#     # "http://172.20.32.119:8000/api/members", # Khanh's Local IP
#     "http://localhost:8000/api/members",
#     data={
#         "psid": 1234567,
#         "email": "test@user.com",
#         "password": "password",
#         "first": "Test",
#         "last": "User",
#         "discord": "discord#1234",
#     },
# )

# r = requests.post(
#     "http://localhost:8000/api/log",
#     data={"psid": 2204169},
# )

r = requests.post(
    "http://localhost:8000/api/log",
    data={"psid": 123},
)

# r = requests.get(
#     "http://localhost:8000/api/log",
#     params={"psid": 4294967295},
# )


pprint(r.json())
