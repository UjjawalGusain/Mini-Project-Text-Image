import cloudinary
from dotenv import load_dotenv
import os

load_dotenv()

CLOUD_NAME = os.getenv("CLOUD_NAME")
API_SECRET = os.getenv("API_SECRET")
API_KEY = os.getenv("API_KEY")

cloudinary.config( 
    cloud_name = CLOUD_NAME, 
    api_key = API_KEY, 
    api_secret = API_SECRET,
    secure=True
)