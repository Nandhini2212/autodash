import pandas as pd
import numpy as np
import faiss
from langchain_community.document_loaders import CSVLoader
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage

# Load CSV data
csv_loader = CSVLoader(file_path=r"C:\Dashboard Assist\server\uploads\uploaded_file.csv", encoding="utf-8")
documents = csv_loader.load()

# Extract document texts
doc_texts = [doc.page_content for doc in documents]
print(f"Loaded {len(doc_texts)} documents from CSV.")

# Initialize embedding model
embedding_model = HuggingFaceEmbeddings(model_name="shuggingface/ft-transformer")

# Generate document embeddings
doc_vectors = embedding_model.embed_documents(doc_texts)
doc_vectors_np = np.array(doc_vectors, dtype="float32")

# Normalize document embeddings (for cosine similarity)
faiss.normalize_L2(doc_vectors_np)

# Create FAISS index (L2 search)
dimension = doc_vectors_np.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(doc_vectors_np)

print(f"FAISS index created with {index.ntotal} vectors.")

# Initialize Groq LLM
groq_llm = ChatGroq(model_name="mixtral-8x7b-32768", api_key="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")  # Replace with actual API key

# Function to search FAISS and get similar documents
def search_faiss(query, k=5):
    """Search FAISS for similar documents given a query."""
    query_embedding = np.array(embedding_model.embed_query(query), dtype="float32").reshape(1, -1)
    faiss.normalize_L2(query_embedding)  # Normalize query embedding
    distances, indices = index.search(query_embedding, k)
    return [documents[i].page_content for i in indices[0]]

# Query FAISS index
query_text = "What is the average price of cars over the time period?"
similar_docs = search_faiss(query_text, k=5)

# Generate a response using Groq LLM
if similar_docs:
    prompt = "Summarize this: " + " ".join(similar_docs)
    response = groq_llm.invoke([HumanMessage(content=prompt)])
    print("\n🔹 **Generated Answer:**\n", response.content)
else:
    print("No relevant documents found.")
