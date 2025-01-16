from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.database.connect import chroma_client
from typing import List

router = APIRouter()

def get_user_collection(user_id: str):
    collection_name = f"image_embeddings_{user_id}"
    return chroma_client.get_or_create_collection(name=collection_name)

class EmbeddingInput(BaseModel):
    user_id: str  
    embedding_ids: list
    embeddings: list 

class QueryInput(BaseModel):
    user_id: str  
    query_embeddings: list  
    top_k: int = 3  

class RemoveEmbeddingInput(BaseModel):
    user_id: str 
    embedding_ids: List[str]



@router.post("/add-image-embedding")
async def add_image_embedding(embedding_input: EmbeddingInput):
    try:
        collection = get_user_collection(embedding_input.user_id)
        collection.add(ids=embedding_input.embedding_ids, embeddings=embedding_input.embeddings)

        return {"message": "Embedding added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding embedding: {e}")

@router.post("/query-image-embedding")
async def query_image_embedding(query_input: QueryInput):
    try:
        collection = get_user_collection(query_input.user_id)
        results = collection.query(query_embeddings=query_input.query_embeddings, n_results=query_input.top_k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying embeddings: {e}")

@router.delete("/remove-image-embedding")
async def remove_image_embedding(remove_input: RemoveEmbeddingInput):
    try:
        # print("We did reach here")
        collection = get_user_collection(remove_input.user_id)
        # print("and here")
        collection.delete(ids=remove_input.embedding_ids)
        # print("Here?")
        return {"message": "Embedding(s) removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing embedding: {e}")



