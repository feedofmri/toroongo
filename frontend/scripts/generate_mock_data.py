
import random
import json

# Configuration
NUM_SELLERS = 15
NUM_PRODUCTS = 150
NUM_TESTIMONIALS = 40

CATEGORIES = [
    {"id": 1, "name": "Electronics", "slug": "electronics", "icon": "Laptop"},
    {"id": 2, "name": "Fashion", "slug": "fashion", "icon": "Shirt"},
    {"id": 3, "name": "Home & Living", "slug": "home-living", "icon": "Home"},
    {"id": 4, "name": "Beauty", "slug": "beauty", "icon": "Sparkles"},
    {"id": 5, "name": "Sports", "slug": "sports", "icon": "Dumbbell"},
    {"id": 6, "name": "Books", "slug": "books", "icon": "BookOpen"},
    {"id": 7, "name": "Toys & Games", "slug": "toys-games", "icon": "Gamepad2"},
    {"id": 8, "name": "Health", "slug": "health", "icon": "Pill"},
]

SELLER_NAMES = [
    "Sony Electronics", "Urban Threads", "NaturGlow", "TechVault", "EcoHome",
    "FitGear", "Bibliophile Haven", "ToyBox", "Wellness Hub", "Glamour Shop",
    "Modern Living", "Pixel Perfect", "Style Avenue", "Green Life", "Comfort Zone"
]

PRODUCT_ADJECTIVES = ["Premium", "Essential", "Advanced", "Classic", "Modern", "Organic", "Durable", "Sleek", "Professional", "Ultimate"]
UNSPLASH_IDS = [
    "photo-1618366712010-f4ae9c647dcb", "photo-1517336714731-489689fd1ca8", "photo-1527864550417-7fd91fc51a46",
    "photo-1595225476474-87563907a212", "photo-1556821840-3a63f95609a7", "photo-1553062407-98eeb64c6a62",
    "photo-1620916566398-39f1143ab7be", "photo-1611930022073-b7a4ba5fcccd", "photo-1507473885765-e6ed057ab6fe",
    "photo-1542291026-7eec264c27ff", "photo-1590658268037-6bf12f032f55", "photo-1556679343-c7306c1976bc",
    "photo-1523275335684-37898b6baf30", "photo-1505740420928-5e560c06d30e", "photo-1543163530-1073da1e94ba",
    "photo-1560343090-f0409e92791a", "photo-1572635196237-14b3f281503f", "photo-1583394838336-acd977730f8a"
]

TESTIMONIAL_TEXTS = [
    "Absolutely love my purchase! The quality exceeded my expectations. Shipping was incredibly fast.",
    "Toroongo has become my go-to marketplace. The variety of sellers means I always find exactly what I need.",
    "Great platform with genuine products. I was skeptical at first, but the reviews and seller ratings helped me.",
    "The interface is so clean compared to other sites. I found a specialized seller and the price was unbeatable.",
    "Best shopping experience ever! Highly recommended.",
    "Quality products and great service. Will buy again.",
    "Love the designs and the quality of the items I bought.",
    "Super fast delivery and everything was perfect.",
    "The customer support is top-notch.",
    "Found exactly what I was looking for at a great price."
]

USER_NAMES = ["Sarah Mitchell", "James Rodriguez", "Aisha Patel", "David Chen", "Emily Brown", "Michael Wilson", "Li Wei", "Sofia Rossi", "John Doe", "Jane Smith"]

def generate_sellers():
    sellers = []
    for i in range(1, NUM_SELLERS + 1):
        name = SELLER_NAMES[i-1]
        sellers.append({
            "id": i,
            "name": name,
            "slug": name.lower().replace(" ", "-"),
            "description": f"Official {name} store offering premium products and services.",
            "logo": f"https://images.unsplash.com/photo-{random.choice(UNSPLASH_IDS)}?auto=format&fit=crop&q=80&w=100&h=100",
            "banner": f"https://images.unsplash.com/photo-{random.choice(UNSPLASH_IDS)}?auto=format&fit=crop&q=80&w=1200&h=400",
            "rating": round(random.uniform(4.0, 5.0), 1),
            "totalProducts": random.randint(50, 1000),
            "joinedDate": f"2024-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}",
            "brandColor": f"#{random.randint(0, 0xFFFFFF):06x}"
        })
    return sellers

def generate_products(sellers):
    products = []
    for i in range(1, NUM_PRODUCTS + 1):
        category = random.choice(CATEGORIES)
        seller = random.choice(sellers)
        price = round(random.uniform(10, 2000), 2)
        has_discount = random.random() < 0.3
        original_price = round(price / (1 - random.uniform(0.1, 0.3)), 2) if has_discount else None
        discount = int(((original_price - price) / original_price) * 100) if has_discount else 0
        
        products.append({
            "id": i,
            "title": f"{random.choice(PRODUCT_ADJECTIVES)} {category['name']} Item {i}",
            "price": price,
            "originalPrice": original_price,
            "discount": discount,
            "rating": round(random.uniform(3.5, 5.0), 1),
            "reviews": random.randint(10, 5000),
            "seller": seller["name"],
            "sellerId": f"seller_{seller['id']}",
            "category": category["slug"],
            "badge": random.choice(["Best Seller", "New", "Sale", None, None]),
            "imageUrl": f"https://images.unsplash.com/photo-{random.choice(UNSPLASH_IDS)}?auto=format&fit=crop&q=80&w=400"
        })
    return products

def generate_testimonials():
    testimonials = []
    for i in range(NUM_TESTIMONIALS):
        testimonials.append({
            "name": random.choice(USER_NAMES) + f" {chr(65+i%26)}.",
            "avatar": f"https://images.unsplash.com/photo-{random.choice(UNSPLASH_IDS)}?auto=format&fit=crop&q=80&w=80&h=80",
            "role": "Verified Buyer",
            "purchased": f"Premium Product {i+1}",
            "rating": random.randint(4, 5),
            "text": random.choice(TESTIMONIAL_TEXTS),
            "date": f"{random.randint(1, 14)} days ago"
        })
    return testimonials

# Generation
sellers_data = generate_sellers()
products_data = generate_products(sellers_data)
testimonials_data = generate_testimonials()

# Output (formatted for JS)
print("export const sellers = " + json.dumps(sellers_data, indent=4) + ";")
print("\nexport const products = " + json.dumps(products_data, indent=4) + ";")
print("\nexport const testimonials = " + json.dumps(testimonials_data, indent=4) + ";")

    main()
