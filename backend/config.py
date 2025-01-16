import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=dotenv_path)
DATABASE_URL = os.getenv("DATABASE_URL")
CLOUD_NAME = os.getenv("CLOUD_NAME")
API_SECRET = os.getenv("API_SECRET")
API_KEY = os.getenv("API_KEY")
SECRET_KEY = os.getenv("SECRET_KEY") 
MODEL_PATH = os.getenv("MODEL_PATH")