from fastapi import APIRouter, UploadFile, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from backend.postgres_database.connect import get_db, Image
from backend.api.services.image_service import upload_image_to_cloudinary, delete_image_from_cloudinary
from pydantic import BaseModel
import os
import httpx
import base64
from typing import List
from sqlalchemy import case
from backend.api.routers.db_routes import remove_image_embedding, RemoveEmbeddingInput

router = APIRouter()

class GetImagesRequest(BaseModel):
    user_id: str
    image_ids: List[str]

@router.post("/upload-image")
async def upload_image(
    file: UploadFile,
    userid: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        local_path = f"temp_{file.filename}"
        with open(local_path, "wb") as temp_file:
            temp_file.write(await file.read())

        cloudinary_response = upload_image_to_cloudinary(local_path)

        with open(local_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode("utf-8")

        async with httpx.AsyncClient() as client:
            embedding_response = await client.post(
                "http://localhost:8000/embedding/image-embedding",
                json={"image": base64_image}
            )
            if embedding_response.status_code != 200:
                raise HTTPException(
                    status_code=500, detail="Failed to generate image embedding"
                )
            embedding = embedding_response.json()["embedding"]


        # Save image in PostgreSQL
        new_image = Image(
            public_id=cloudinary_response["public_id"],
            url=cloudinary_response["secure_url"],
            user_id=userid
        )
        db.add(new_image)
        db.commit()
        db.refresh(new_image)


        async with httpx.AsyncClient() as client:
            embedding_payload = {
                "user_id": userid,
                "embedding_ids": [cloudinary_response["public_id"]],
                "embeddings": embedding
            }
            response = await client.post(
                "http://localhost:8000/db/add-image-embedding", json=embedding_payload
            )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=500, detail="Failed to store embedding in ChromaDB"
                )

        # Clean up the local image file
        os.remove(local_path)

        return {
            "message": "Image uploaded successfully",
            "image_id": new_image.id,
            "url": new_image.url,
            "user_id": userid
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    


@router.delete("/delete-image/{image_id}")
async def delete_image(image_id: str, db: Session = Depends(get_db)):
    try:
        # Retrieve the image record from PostgreSQL
        image_record = db.query(Image).filter(Image.id == image_id).first()
        if not image_record:
            raise HTTPException(status_code=404, detail="Image not found")

        user_id = image_record.user_id
        public_id = image_record.public_id

        delete_response = delete_image_from_cloudinary(public_id)
        if delete_response.get("result") != "ok":
            raise HTTPException(status_code=500, detail="Failed to delete image from Cloudinary")
       
        async with httpx.AsyncClient() as client:
            removal_payload = RemoveEmbeddingInput(
                user_id=user_id,
                embedding_ids=[public_id],
            )
            try:
                # print(f"Removal payload: {removal_payload}")
                response = await remove_image_embedding(removal_payload)
                # print(f"This part also done: {response}")
                # print(f'Response: {response}')
            except HTTPException as e:
                print(f"Error occurred: {e.detail}")
                raise HTTPException(
                    status_code=500, detail="Failed to remove embedding from ChromaDB"
                )

        # Delete the image record from PostgreSQL
        db.delete(image_record)
        db.commit()

        return {"message": "Image deleted successfully", "image_id": image_id}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-images/{user_id}")
async def get_images(user_id: str, db: Session = Depends(get_db)):
    """
    Retrieve all images for a specific user by user ID.
    """
    try:
        images = db.query(Image).filter(Image.user_id == user_id).all()

        if not images:
            raise HTTPException(status_code=404, detail="No images found for the user")

        image_list = [
            {
                "id": image.id,
                "public_id": image.public_id,
                "url": image.url,
                "user_id": image.user_id,
            }
            for image in images
        ]

        return {"message": "Images retrieved successfully", "images": image_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/get-images-by-ids")
async def get_images_by_ids(request: GetImagesRequest, db: Session = Depends(get_db)):
    """
    Retrieve specific images for a user by image IDs and user ID.
    """
    image_ids = request.image_ids
    user_id = request.user_id

    # print(image_ids)
    # print(user_id)
    
    try:
        image_order = case(
            {str(id): index for index, id in enumerate(image_ids)}, 
            value=Image.public_id
        )
        images = db.query(Image).filter(Image.public_id.in_(image_ids), Image.user_id == user_id).order_by(image_order).all()
        
        
        if not images:
            raise HTTPException(status_code=404, detail="No images found for the provided IDs and user")

        image_list = [
            {
                "id": image.id,
                "public_id": image.public_id,
                "url": image.url,
                "user_id": image.user_id,
            }
            for image in images
        ]
        # print(f"Image list: {image_list}")

        return {"message": "Images retrieved successfully", "images": image_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))