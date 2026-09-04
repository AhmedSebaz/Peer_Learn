from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

# .env ফাইল থেকে কনফিগারেশন লোড করা
load_dotenv()

# MySQL কানেকশন স্ট্রিং
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:Istiack123%40@localhost:3306/campusconnect")

# MySQL ইঞ্জিন তৈরি করা (pool_pre_ping=True যুক্ত করা হয়েছে)
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# সেশন লোকাল তৈরি
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# বেস ক্লাস মডেলের জন্য (মডার্ন ইমপোর্ট)
Base = declarative_base()

# ডিপেন্ডেন্সি ফাংশন যা API রাউটে ডাটাবেজ সেশন প্রদান করবে
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()