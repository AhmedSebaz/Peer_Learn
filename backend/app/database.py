from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# .env ফাইল থেকে কনফিগারেশন লোড করা
load_dotenv()

# MySQL কানেকশন স্ট্রিং (Format: mysql+pymysql://username:password@host:port/database_name)
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:Istiack123%40@localhost:3306/campusconnect")
# MySQL ইঞ্জিন তৈরি করা
engine = create_engine(DATABASE_URL)

# সেশন লোকাল তৈরি
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# বেস ক্লাস মডেলের জন্য
Base = declarative_base()

# ডিপেন্ডেন্সি ফাংশন যা API রাউটে ডাটাবেজ সেশন প্রদান করবে
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()