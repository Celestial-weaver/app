import json
import uuid
from datetime import datetime, timedelta
from faker import Faker
import random

fake = Faker()

# Load previously generated users data to get valid user_ids
with open('users_dataset.json') as f:
    users_data = json.load(f)

# Get all partner user_ids (user_type = 'partner')
partner_user_ids = [user['id'] for user in users_data['users'] if user['user_type'] == 'partner']

# Specializations options
specializations_options = [
    "Wedding Photography", "Portrait Photography", "Commercial Photography",
    "Event Photography", "Fashion Photography", "Product Photography",
    "Real Estate Photography", "Food Photography", "Aerial Photography",
    "Sports Photography", "Documentary Photography", "Newborn Photography"
]

# Document statuses
doc_statuses = ['pending', 'approved', 'rejected']

# Service price units
price_units = ['per_hour', 'per_day', 'per_project']

# Partner types
partner_types = ['studio', 'solo', 'firm', 'partnership']

# Indian cities with coordinates
indian_cities = [
    {"city": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lng": 72.8777},
    {"city": "Delhi", "state": "Delhi", "lat": 28.7041, "lng": 77.1025},
    {"city": "Bangalore", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946},
    {"city": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867},
    {"city": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707},
    {"city": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639},
    {"city": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567},
    {"city": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lng": 75.7873},
    {"city": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lng": 72.5714},
    {"city": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lng": 80.9462}
]

def generate_documents():
    num_docs = random.randint(1, 4)
    documents = []
    for _ in range(num_docs):
        doc_type = random.choice(["ID Proof", "Address Proof", "Portfolio", "Certification"])
        status = random.choice(doc_statuses)
        documents.append({
            "doc_name": f"{doc_type} Document",
            "file_url": f"https://example.com/docs/{uuid.uuid4()}.pdf",
            "status": status,
            "rejection_reason": fake.sentence() if status == 'rejected' else None
        })
    return documents

def generate_services():
    num_services = random.randint(2, 6)
    services = []
    for _ in range(num_services):
        service_type = random.choice([
            "Basic Photography", "Premium Photography", "Videography",
            "Photo Editing", "Drone Photography", "Cinematography",
            "Photo Booth", "Album Design", "Pre-Wedding Shoot"
        ])
        services.append({
            "service_id": str(uuid.uuid4()),
            "name": service_type,
            "description": fake.paragraph(nb_sentences=2),
            "base_price": random.randint(500, 50000),
            "price_unit": random.choice(price_units)
        })
    return services

def generate_location_pricing():
    pricing = {}
    for city in random.sample(indian_cities, random.randint(1, 4)):
        pricing[city['city']] = random.randint(1000, 50000)
    return pricing

def generate_payment_methods():
    methods = []
    if random.random() > 0.3:
        methods.append("credit_card")
    if random.random() > 0.3:
        methods.append("debit_card")
    if random.random() > 0.2:
        methods.append("upi")
    if random.random() > 0.5:
        methods.append("bank_transfer")
    if random.random() > 0.7:
        methods.append("cash")
    return {"methods": methods, "preferred": random.choice(methods) if methods else None}

def generate_social_links():
    username = fake.user_name()
    return {
        "website": f"https://{username}.photography.com",
        "instagram": f"https://instagram.com/{username}",
        "facebook": f"https://facebook.com/{username}",
        "x": f"https://x.com/{username}",
        "pinterest": f"https://pinterest.com/{username}",
        "youtube": f"https://youtube.com/{username}" if random.random() > 0.7 else None
    }

def generate_project_stats():
    total = random.randint(5, 200)
    completed = random.randint(3, total)
    ongoing = total - completed - random.randint(0, 5)
    return {
        "total": total,
        "completed": completed,
        "ongoing": max(0, ongoing)
    }

def generate_dashboard_data():
    return {
        "views": random.randint(100, 10000),
        "leads": random.randint(5, 200),
        "conversion_rate": round(random.uniform(0.1, 0.5), 2),
        "revenue": random.randint(5000, 500000),
        "top_services": random.sample(["Wedding", "Portrait", "Commercial"], random.randint(1, 3))
    }

def generate_partner_locations():
    num_locations = random.randint(1, 3)
    locations = []
    for city in random.sample(indian_cities, num_locations):
        locations.append({
            "city": city['city'],
            "state": city['state'],
            "coordinates": {"lat": city['lat'], "lng": city['lng']},
            "pin_codes_served": [fake.postcode() for _ in range(random.randint(1, 3))]
        })
    return locations

# Generate partner records
partners = []
for user_id in partner_user_ids:
    created_at = fake.date_time_between(start_date='-2y', end_date='now')
    updated_at = fake.date_time_between(start_date=created_at, end_date='now')
    
    partner = {
        "user_id": user_id,
        "company_name": fake.company() if random.random() > 0.4 else None,  # 60% have company names
        "specializations": random.sample(specializations_options, random.randint(1, 3)),
        "documents": generate_documents(),
        "banner": f"https://picsum.photos/1200/400?random={random.randint(1, 1000)}",
        "portfolio": [f"https://picsum.photos/800/600?random={random.randint(1, 1000)}" for _ in range(random.randint(3, 10))],
        "experience_years": random.randint(1, 30),
        "services": generate_services(),
        "location_pricing": generate_location_pricing(),
        "payment_methods": generate_payment_methods(),
        "serving_locations": [city['city'] for city in random.sample(indian_cities, random.randint(1, 5))],
        "partner_type": random.choice(partner_types),
        "avg_rating": round(random.uniform(3.0, 5.0), 1),
        "verified": random.random() > 0.3,  # 70% verified
        "social_links": generate_social_links(),
        "project_stats": generate_project_stats(),
        "dashboard_data": generate_dashboard_data(),
        "partner_locations": generate_partner_locations(),
        "created_at": created_at.isoformat(),
        "updated_at": updated_at.isoformat(),
        "deleted_at": fake.date_time_between(start_date=created_at, end_date='now').isoformat() if random.random() > 0.9 else None  # 10% deleted
    }
    partners.append(partner)

# Save to JSON file
with open('partners_dataset.json', 'w') as f:
    json.dump({"partners": partners}, f, indent=2)

print(f"Generated {len(partners)} partner records in partners_dataset.json")
