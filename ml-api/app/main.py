from fastapi import FastAPI
import pandas as pd

app = FastAPI()

# Load dataset
data = pd.read_csv("data/products.csv")

@app.get("/")
def home():
    return {"message": "Recommendation API is running 🚀"}

@app.get("/recommend")
def recommend(category: str):
    recommendations = data[data['category'] == category]
    return recommendations[['id', 'name', 'price']].head(5).to_dict(orient="records")
def recommend(product_id: int):
    try:
        product = data[data['id'] == product_id].iloc[0]
    except:
        # 🔥 fallback if product not found
        return data.sample(3)[['id', 'name', 'price']].to_dict(orient="records")

    category = product['category']

    recommendations = data[data['category'] == category]
    recommendations = recommendations[recommendations['id'] != product_id]

    return recommendations[['id', 'name', 'price']].to_dict(orient="records")