import cloudinary
from ..config import CLOUD_NAME, API_KEY, API_SECRET

cloudinary.config( 
    cloud_name = CLOUD_NAME, 
    api_key = API_KEY, 
    api_secret = API_SECRET,
    secure=True
)