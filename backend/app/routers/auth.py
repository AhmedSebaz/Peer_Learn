from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
import shutil
import os

from app.database import get_db
from app.models import User, StudentProfile, AlumniProfile, Club, UserStatus, UserRole

router = APIRouter(
    tags=["Authentication & Users"]
)

# আপলোড করা ফাইল সেভ করার ফোল্ডার
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ১. লগইন এন্ডপয়েন্ট
@router.post("/auth/login")
def login_user(
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    
    if not user or password != user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="ভুল ইমেইল অথবা পাসওয়ার্ড!"
        )

    # ইউজার রোল ভ্যালিডেশন (Enum স্ট্রিং ভ্যালু কনভার্ট করে চেক করা)
    user_role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
    if user_role_str.lower() != role.lower():
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

    # প্রফাইল পিকচার পাথ ফেচ করা
    profile_pic = None
    if user_role_str.lower() == "student" and user.student_profile:
        profile_pic = user.student_profile.profile_pic
    elif user_role_str.lower() == "alumni" and user.alumni_profile:
        profile_pic = user.alumni_profile.profile_pic

    return {
        "message": "সফলভাবে লগইন হয়েছে!",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user_role_str,
        "profile_pic": profile_pic
    }


# ২. সব রোলের জন্য ইউনিভার্সাল রেজিস্ট্রেশন এন্ডপয়েন্ট
@router.post("/auth/register")
def register_user(
    name: str = Form("User"),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form("student"),
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
            detail="এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে!"
        )

    # আইডি কার্ড বা ডকুমেন্ট ফাইল সেভ করা
    id_card_path = None
    if id_card:
        filename = f"verify_{email.split('@')[0]}_{id_card.filename}"
        id_card_path = os.path.join(UPLOAD_DIR, filename)
        with open(id_card_path, "wb") as buffer:
            shutil.copyfileobj(id_card.file, buffer)

    # ১. মূল users টেবিলে ইউজার তৈরি করা
    new_user = User(
        name=name,
        email=email,
        hashed_password=password,
        role=role,
        status=UserStatus.PENDING
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # ২. রোল অনুযায়ী সংশ্লিষ্ট প্রোফাইল টেবিলে ডাটা এন্ট্রি করা
    if role.lower() == "student":
        student_profile = StudentProfile(
            user_id=new_user.id,
            student_id=f"BUP-{new_user.id}",
            department=department or "CSE",
            batch=batch or "3.2",
            semester="3.2",
            linkedin=linkedin,
            bio=bio,
            student_id_card=id_card_path
        )
        db.add(student_profile)

    elif role.lower() == "alumni":
        alumni_profile = AlumniProfile(
            user_id=new_user.id,
            passing_year=2023,
            current_job_title=role_title,
            company="Not Specified",
            linkedin_url=linkedin,
            alumni_id_card=id_card_path
        )
        db.add(alumni_profile)

    elif role.lower() in ["club_lead", "club_admin"]:
        new_club = Club(
            club_name=club_name or "BUP Computer Club",
            lead_user_id=new_user.id,
            description=bio
        )
        db.add(new_club)

    db.commit()

    return {
        "message": "রেজিস্ট্রেশন সফল হয়েছে! এডমিন অ্যাপ্রুভ করার পর লগইন করতে পারবেন।",
        "user_id": new_user.id
    }


# ৩. ইউজার প্রফাইল ও পিকচার আপডেট এন্ডপয়েন্ট (ফ্রন্টএন্ডের সাথে কানেক্টেড)
@router.put("/users/{user_id}/profile")
def update_user_profile(
    user_id: int,
    name: Optional[str] = Form(None),
    department: Optional[str] = Form(None),
    batch: Optional[str] = Form(None),
    role_title: Optional[str] = Form(None),
    linkedin: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    profile_pic: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ইউজার পাওয়া যায়নি!")

    if name:
        user.name = name

    user_role_str = user.role.value if hasattr(user.role, "value") else str(user.role)

    # প্রফাইল ছবি আপলোড হলে সেটি সেভ করা
    profile_pic_path = None
    if profile_pic:
        filename = f"profile_{user.id}_{profile_pic.filename}"
        profile_pic_path = os.path.join(UPLOAD_DIR, filename)
        with open(profile_pic_path, "wb") as buffer:
            shutil.copyfileobj(profile_pic.file, buffer)

    # স্টুডেন্ট প্রফাইল আপডেট
    if user_role_str.lower() == "student":
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
        if profile:
            if department: profile.department = department
            if batch: profile.batch = batch
            if linkedin: profile.linkedin = linkedin
            if bio: profile.bio = bio
            if profile_pic_path: profile.profile_pic = profile_pic_path
        else:
            profile = StudentProfile(
                user_id=user.id,
                student_id=f"BUP-{user.id}",
                department=department or "CSE",
                batch=batch or "3.2",
                semester="3.2",
                linkedin=linkedin,
                bio=bio,
                profile_pic=profile_pic_path
            )
            db.add(profile)

    # অ্যালুনি প্রফাইল আপডেট
    elif user_role_str.lower() == "alumni":
        profile = db.query(AlumniProfile).filter(AlumniProfile.user_id == user.id).first()
        if profile:
            if role_title: profile.current_job_title = role_title
            if linkedin: profile.linkedin_url = linkedin
            if profile_pic_path: profile.profile_pic = profile_pic_path
        else:
            profile = AlumniProfile(
                user_id=user.id,
                passing_year=2023,
                current_job_title=role_title,
                linkedin_url=linkedin,
                profile_pic=profile_pic_path
            )
            db.add(profile)

    db.commit()
    db.refresh(user)

    final_pic = profile_pic_path
    if not final_pic:
        if user_role_str.lower() == "student" and user.student_profile:
            final_pic = user.student_profile.profile_pic
        elif user_role_str.lower() == "alumni" and user.alumni_profile:
            final_pic = user.alumni_profile.profile_pic

    return {
        "message": "প্রোফাইল সফলভাবে আপডেট হয়েছে!",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user_role_str,
        "profile_pic": final_pic
    }