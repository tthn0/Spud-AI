import requests

# requests.post(
#     # "http://172.20.32.119:8000/api/members", # Khanh's Local IP
#     "http://localhost:8000/api/members",
#     data={
#         "psid": 9876543210,
#         "email": "local@ip.address",
#         "password": "password",
#         "first": "Local",
#         "last": "IP",
#         "discord": "Discord",
#     },
# )

requests.post(
    "http://localhost:8000/api/log",
    data={"psid": 9876543210},
)
