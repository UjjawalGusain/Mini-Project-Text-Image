from backend.cloudinary.cloudinary_config import cloudinary
import cloudinary.uploader


def upload_image_to_cloudinary(image_path):
    """
    Uploads an image to Cloudinary.
    :param image_path: Local path to the image file.
    :return: Cloudinary response (including public_id and URL).
    """
    try:
        response = cloudinary.uploader.upload(image_path)
        return response  
    except Exception as e:
        raise Exception(f"Failed to upload image to Cloudinary: {e}")

def delete_image_from_cloudinary(public_id):
    """
    Deletes an image from Cloudinary using its public_id.
    :param public_id: Cloudinary public_id of the image.
    :return: Response from Cloudinary after deletion.
    """
    try:
        response = cloudinary.uploader.destroy(public_id)
        print(f'Response: {response}')
        return response 
    except Exception as e:
        raise Exception(f"Failed to delete image from Cloudinary: {e}")