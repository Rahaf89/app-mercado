# Use a pipeline as a high-level helper
from transformers import pipeline

pipe = pipeline("text-classification", model="Narrativaai/fake-news-detection-spanish")

from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained("Narrativaai/fake-news-detection-spanish")
model = AutoModelForSequenceClassification.from_pretrained("Narrativaai/fake-news-detection-spanish")

def detectFakeNews(text):
    results = pipe(text)
    return results
