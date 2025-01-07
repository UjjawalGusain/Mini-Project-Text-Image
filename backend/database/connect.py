import psycopg2
from chromadb.config import Settings
import chromadb

chroma_client = chromadb.PersistentClient(path="/db")
