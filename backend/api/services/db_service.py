from database.connect import chroma_client

def add_image_embeddings(embedding_ids, embeddings, collection_name):
    collection = chroma_client.get_or_create_collection(name=collection_name)
    collection.add(embedding_ids=embedding_ids, embeddings=embeddings)

def query_embeddings(query_embedding, collection_name, top_k=3):
    collection = chroma_client.get_or_create_collection(name=collection_name)
    results = collection.query(query_embeddings=[query_embedding], n_results=top_k)
    return results

def remove_image_embedding(embedding_ids, collection_name):
    collection = chroma_client.get_or_create_collection(name=collection_name)
    try:
        collection.delete(ids=embedding_ids)
    except Exception as e:
        print(f"Error removing embedding: {e}")
