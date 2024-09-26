import requests
from dotenv import load_dotenv
import os

load_dotenv()
BUCKET_URL = os.getenv('BUCKET_URL')
response = requests.put(BUCKET_URL+'suggestions.txt', data="List of suggestions:")