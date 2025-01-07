import base64
import io
from PIL import Image
import torch
from transformers import AutoTokenizer, ViTImageProcessor
import torch.nn.functional as F
import os


MODEL_PATH = 'D:/newVsCode/Mini-Project-Text-Image/backend/models/siamese_traced_model.pt'
traced_model = torch.jit.load(MODEL_PATH)

class EmbeddingService:
    def __init__(self, device=None):
        self.device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = traced_model.to(self.device)
        self.tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
        self.image_processor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")

    def preprocess_image(self, image_base64: str):

        """Preprocess a base64-encoded image for embedding generation."""
        try:
            image_bytes = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            image_tensor = self.image_processor(images=image, return_tensors="pt")["pixel_values"].squeeze(0)
            return image_tensor.to(self.device)
        except Exception as e:
            raise ValueError(f"Invalid image format: {e}")

    def preprocess_text(self, text: str, max_length=128):
        """Preprocess a text string for embedding generation."""
        inputs = self.tokenizer.encode_plus(
            text,
            truncation=True,
            add_special_tokens=True,
            max_length=max_length,
            padding="max_length",
            return_tensors="pt"
        )
        input_ids = inputs["input_ids"].squeeze(0).to(self.device)
        attention_mask = inputs["attention_mask"].squeeze(0).to(self.device)
        return input_ids, attention_mask

    def get_image_embedding(self, image_tensor: torch.Tensor):
        """Generate and normalize an image embedding."""
        with torch.no_grad():
            embedding = self.model.get_image_embeddings(image_tensor.unsqueeze(0))
        return F.normalize(embedding, p=2, dim=1).cpu().numpy()

    def get_text_embedding(self, input_ids: torch.Tensor, attention_mask: torch.Tensor):
        """Generate and normalize a text embedding."""
        with torch.no_grad():
            embedding = self.model.get_text_embeddings(input_ids.unsqueeze(0), attention_mask.unsqueeze(0))
        return F.normalize(embedding, p=2, dim=1).cpu().numpy()
