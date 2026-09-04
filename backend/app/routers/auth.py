from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
import shutil
import os

from app.database import get_db
from app.models import User, UserStatus
from app.utils import verify_password, get_password_hash  # পাসওয়ার্ড হ্যাশ ও ভেরিফিকেশনের জন্য

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# আপলোড করা আইডি কার্ড বা সার্টিফিকেট সেভ করার ফোল্ডার
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ১. লগইন এন্ডপয়েন্ট
@router.post("/login")
def login_user(
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="ভুল ইমেইল অথবা পাসওয়ার্ড!"
        )

    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="ভুল ইমেইল অথবা পাসওয়ার্ড!"
        )

    if user.role.lower() != role.lower():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail=f"এই অ্যাকাউন্টটি {role} রোলের জন্য নয়!"
        )

    if user.status == UserStatus.BANNED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="আপনার অ্যাকাউন্টটি ব্যান করা হয়েছে!"
        )
    
    if user.status == UserStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="আপনার অ্যাকাউন্টটি এখনো এডমিন কর্তৃক অনুমোদিত (Pending) হয়নি!"
        )

    return {
        "message": "সফলভাবে লগইন হয়েছে!",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }


# ২. রেজিস্ট্রেশন এন্ডপয়েন্ট (ফাইল আপলোডসহ)
@router.post("/register")
def register_user(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    department: Optional[str] = Form(None),
    batch: Optional[str] = Form(None),
    role_title: Optional[str] = Form(None),
    club_name: Optional[str] = Form(None),
    linkedin: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    id_card: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # ইমেইল ইতিমধ্যে রেজিস্টার্ড আছে কিনা চেক করা
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে!"
        )

    # আইডি কার্ড বা ডকুমেন্ট ফাইল সেভ করা
    id_card_path = None
    if id_card:
        filename = f"verify_{email.split('@')[0]}_{id_card.filename}"
        id_card_path = os.path.join(UPLOAD_DIR, filename)
        with open(id_card_path, "wb") as buffer:
            shutil.copyfileobj(id_card.file, buffer)

    # পাসওয়ার্ড হ্যাশ করা
    hashed_password = get_password_hash(password)

    # নতুন ইউজার তৈরি (নতুন রেজিস্ট্রেশন সাধারণত PENDING স্ট্যাটাসে থাকবে)
    new_user = User(
        name=name,
        email=email,
        hashed_password=hashed_password,
        role=role,
        department=department,
        batch=batch,
        role_title=role_title,
        club_name=club_name,
        linkedin=linkedin,
        bio=bio,
        id_card_path=id_card_path,
        status=UserStatus.PENDING  # এডমিন অ্যাপ্রুভালের জন্য পেন্ডিং থাকবে
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "রেজিস্ট্রেশন সফল হয়েছে! এডমিন অ্যাপ্রুভ করার পর লগইন করতে পারবেন।",
        "user_id": new_user.id
    }