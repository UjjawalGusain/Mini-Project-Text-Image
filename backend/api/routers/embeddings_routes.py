from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.api.services.embedding_service import EmbeddingService

router = APIRouter()

embedding_service = EmbeddingService()

class TextInput(BaseModel):
    text: str

class ImageInput(BaseModel):
    image: str  # Base64-encoded image string


@router.post("/image-embedding")
async def get_image_embedding(image_input: ImageInput):
    """API endpoint to get image embeddings."""
    try:
        image_tensor = embedding_service.preprocess_image(image_input.image)
        embedding = embedding_service.get_image_embedding(image_tensor)
        return {"embedding": embedding.tolist()}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/text-embedding")
async def get_text_embedding(text_input: TextInput):
    """API endpoint to get text embeddings."""
    try:
        input_ids, attention_mask = embedding_service.preprocess_text(text_input.text)
        embedding = embedding_service.get_text_embedding(input_ids, attention_mask)
        return {"embedding": embedding.tolist()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
