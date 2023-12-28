from fastapi import FastAPI
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#!   ___  ___  _______ _______  _____
#!  / _ )/ _ |/ ___/ //_/ __/ |/ / _ \
#! / _  / __ / /__/ ,< / _//    / // /
#!/____/_/ |_\___/_/|_/___/_/|_/____/



@app.get('/')
def getroot(debug:bool = False):
    return 'Root'
