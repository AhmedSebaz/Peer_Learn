from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import os

from app.database import engine, Base
from app.routers import auth, student, admin, alumni, club_lead

# ডাটাবেজ টেবিলগুলো অটোমেটিক ক্রিয়েট করা
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CampusConnect API",
    description="Backend for Campus Community, Mentorship, and Event Management Platform",
    version="1.0.0"
)

# ৪২২ ভ্যালিডেশন এরর টার্মিনালে প্রিন্ট করার জন্য এক্সসেপশন হ্যান্ডলার
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print("--- 422 VALIDATION ERROR ---")
    print("Errors:", exc.errors())
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

# আপলোড করা ফাইলগুলো ফ্রন্টএন্ড থেকে সরাসরি দেখার জন্য স্ট্যাটিক ডিরেক্টরি সেটআপ
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# CORS মিডলওয়্যার (ফ্রন্টএন্ডের সাথে কানেক্ট করার জন্য)
origins = [
    "http://localhost:5173",  # Vite ফ্রন্টএন্ড লোকাল পোর্ট
    "http://127.0.0.1:5173",
    "http://localhost:3000",  
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# বর্তমান ফাইলগুলো অনুযায়ী রাউটারগুলো রেজিস্টার করা হলো
app.include_router(auth.router)
app.include_router(student.router)
# app.include_router(admin.router)
# app.include_router(alumni.router)
# app.include_router(club_lead.router)

# রুট বা হোম এন্ডপয়েন্ট
@app.get("/")
def read_root():
    return {"message": "Welcome to CampusConnect API! Server is running successfully."}