from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import uuid

DATABASE_URL='postgresql://neondb_owner:BiNja8qZCwt1@ep-black-cherry-a5kesxay.us-east-2.aws.neon.tech/neondb?sslmode=require'

# SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()

# User model
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, index=True, nullable=False)  # Unique username
    userid = Column(String, unique=True, index=True, nullable=False)  # Unique user ID
    password = Column(String, nullable=False)  # Hashed password

class Image(Base):
    __tablename__ = "images"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    public_id = Column(String, nullable=False)
    url = Column(String, nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False) # Foreign key to User table


# Create all tables in the database
Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

