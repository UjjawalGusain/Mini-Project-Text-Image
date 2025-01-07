from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.postgres_database.connect import get_db, User
from pydantic import BaseModel
import uuid
import bcrypt
import jwt
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta, timezone

router = APIRouter()

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY") 
ALGORITHM = "HS256"

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/create-user")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user_id = str(uuid.uuid4())
    
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    
    new_user = User(username=user.username, userid=user_id, password=hashed_password.decode('utf-8'))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully", "userid": user_id}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    payload = {
        "userid": db_user.userid,
        "username": db_user.username,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)  # Token expires in 24 hours
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"message": "Login successful", "token": token}

@router.get("/get-user/{username}")
def get_user(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"username": user.username, "userid": user.userid}

# Route to fetch a user_id
@router.get("/get-user-id/{username}")
def get_user(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"username": user.username, "userid": user.id}

