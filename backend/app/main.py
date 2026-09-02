from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import engine, Base
from app.routers import student

# ডাটাবেজ টেবিলগুলো অটোমেটিক ক্রিয়েট করা
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CampusConnect API - Student Module",
    description="Backend for Campus Community, Mentorship, and Event Management Platform",
    version="1.0.0"
)

# আপলোড করা ফাইলগুলো ফ্রন্টএন্ড থেকে সরাসরি দেখার জন্য স্ট্যাটিক ডিরেক্টরি সেটআপ
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# CORS মিডলওয়্যার (ফ্রন্টএন্ডের সাথে কানেক্ট করার জন্য)
origins = [
    "http://localhost:3000",  # React / Next.js লোকাল পোর্ট
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# শুধু স্টুডেন্ট রাউটার অ্যাপ্লিকেশনে রেজিস্টার করা
app.include_router(student.router)

# রুট বা হোম এন্ডপয়েন্ট
@app.get("/")
def read_root():
    return {"message": "Welcome to CampusConnect API (Student Module)! Server is running successfully."}