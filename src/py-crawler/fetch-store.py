import requests
import os

url = os.environ['GASAPI_CARD_STORE']
resp = requests.get(url)

print(resp.text)