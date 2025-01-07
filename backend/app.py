from fastapi import FastAPI
from .api.routers.db_routes import router as db_router
from .api.routers.embeddings_routes import router as embedding_router
from .api.routers.user_routes import router as user_router
from .api.routers.image_routes import router as image_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


app.include_router(embedding_router, prefix="/embedding", tags=["embedding"])
app.include_router(db_router, prefix="/db", tags=["database"])
app.include_router(user_router, prefix="/user", tags=["user"])
app.include_router(image_router, prefix="/images", tags=["Images"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Image-Text Searcher API!"}


# => uvicorn backend.app:app --reload
