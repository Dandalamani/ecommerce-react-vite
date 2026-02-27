import pandas as pd

# Load dataset
data = pd.read_csv("data/products.csv")

def recommend(product_id):
    # Get selected product
    product = data[data['id'] == product_id].iloc[0]
    
    # Get category
    category = product['category']
    
    # Find similar products
    recommendations = data[data['category'] == category]
    
    # Remove selected product
    recommendations = recommendations[recommendations['id'] != product_id]
    
    return recommendations[['id', 'name', 'price']].head(5)

# Test the function
print(recommend(1))