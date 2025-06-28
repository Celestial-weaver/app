import json
import uuid
from datetime import datetime, timedelta
from faker import Faker
import bcrypt
import random

fake = Faker()

def get_hashed_password():
    password = "Password@123"
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8', errors='ignore')

def get_phone_number():
    return {
        "country_code": "+91",
        "number": fake.numerify('##########')
    }

def random_timestamp(start=None, end=None):
    if start is None:
        start = datetime.now() - timedelta(days=730)
    if end is None:
        end = datetime.now()
    return fake.date_time_between(start_date=start, end_date=end)

def get_notification_prefs():
    return {
        "email": random.choice([True, False]),
        "sms": random.choice([True, False]),
        "push": random.choice([True, False]),
        "promotional": random.choice([True, False])
    }

users = []
count = 3000
for _ in range(count):
    user_type = random.choices(
        ['client', 'partner', 'admin'],
        weights=[0.8, 0.15, 0.05]
    )[0]

    created_at = random_timestamp()
    updated_at = random_timestamp(start=created_at)

    deleted_at = None
    if random.random() > 0.9:
        deleted_at = random_timestamp(start=updated_at).isoformat()

    user = {
        "id": str(uuid.uuid4()),
        "username": fake.user_name(),
        "password": get_hashed_password(),
        "email": fake.email(),
        "email_verified_at": random_timestamp(start=created_at).isoformat() if random.random() > 0.3 else None,
        "phone": get_phone_number(),
        "phone_verified_at": random_timestamp(start=created_at).isoformat() if random.random() > 0.4 else None,
        "profile_pic": f"https://randomuser.me/api/portraits/{random.choice(['men', 'women'])}/{random.randint(1, 99)}.jpg",
        "address": fake.address().replace("\n", ", "),
        "user_type": user_type,
        "plan_id": str(uuid.uuid4()) if user_type == 'client' and random.random() > 0.5 else None,
        "last_login_at": random_timestamp(start=created_at).isoformat() if random.random() > 0.2 else None,
        "notification_preferences": get_notification_prefs(),
        "created_at": created_at.isoformat(),
        "updated_at": updated_at.isoformat(),
        "deleted_at": deleted_at
    }
    users.append(user)

with open('users_dataset.json', 'w') as f:
    json.dump({"users": users}, f, indent=2)

print("Generated",count,"  user records in users_dataset.json")
