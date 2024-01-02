from pprint import pprint
import requests

r = requests.get("https://randomuser.me/api?inc=name,email,login,id,picture&results=50")

pprint(r.json()["results"][0])

schema: dict = {
    "results": [
        {
            "name": {"title": "Miss", "first": "Jennie", "last": "Nichols"},
            "email": "jennie.nichols@example.com",
            "login": {
                "username": "yellowpeacock117",
                "password": "addison",
            },
            "id": {"name": "SSN", "value": "405-88-3636"},
            "picture": {
                "large": "https://randomuser.me/api/portraits/men/75.jpg",
                "medium": "https://randomuser.me/api/portraits/med/men/75.jpg",
                "thumbnail": "https://randomuser.me/api/portraits/thumb/men/75.jpg",
            },
        }
    ],
    "info": {"seed": "56d27f4a53bd5441", "results": 1, "page": 1, "version": "1.4"},
}
