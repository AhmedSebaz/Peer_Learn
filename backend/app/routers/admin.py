from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.models import User, StudentProfile, AlumniProfile, Note, JobPost, UserStatus, UserRole

router = APIRouter(
    prefix="/admin",
    tags=["Admin Management"]
)

# Request Payloads
class VerificationActionRequest(BaseModel):
    action: str # 'accept' বা 'reject'

class StatusUpdateRequest(BaseModel):
    status: str # 'Active' বা 'Suspended' (অথবা 'active', 'rejected', 'pending')


# ১. এডমিন ড্যাশবোর্ড ওভারভিউ স্ট্যাটস (Admin Dashboard Stats)
@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    students_count = db.query(User).filter(User.role == UserRole.STUDENT).count()
    alumni_count = db.query(User).filter(User.role == UserRole.ALUMNI).count()
    pending_verifications = db.query(User).filter(User.status == UserStatus.PENDING).count()
    
    # পেন্ডিং বা ফ্ল্যাগড নোটস/কোয়েশ্চেন গণনা
    flagged_reports = db.query(Note).filter(Note.status == "pending").count()

    return {
        "totalUsers": total_users,
        "studentsCount": students_count,
        "alumniCount": alumni_count,
        "pendingVerifications": pending_verifications,
        "flaggedReports": flagged_reports,
        "activeEvents": 5, # স্ট্যাটিক বা ইভেন্ট টেবিল থেকে আনতে পারো
    }


# ২. আইডি ভেরিফিকেশন কিউ (Pending Users List)
@router.get("/verifications/pending")
def get_pending_verifications(db: Session = Depends(get_db)):
    pending_users = db.query(User).filter(User.status == UserStatus.PENDING).all()
    result = []
    
    for u in pending_users:
        doc_path = None
        dept = "CSE"
        student_id_val = f"BUP-{u.id}"
        
        role_str = u.role.value if hasattr(u.role, "value") else str(u.role)
        
        if role_str.lower() == "student" and u.student_profile:
            doc_path = u.student_profile.student_id_card
            dept = u.student_profile.department
            student_id_val = u.student_profile.student_id
        elif role_str.lower() == "alumni" and u.alumni_profile:
            doc_path = u.alumni_profile.alumni_id_card
            dept = "Alumni"

        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": role_str.capitalize(),
            "department": dept,
            "student_id": student_id_val,
            "submitted_date": "Recent",
            "document_path": doc_path
        })
    return result


# ৩. ইউজারের ভেরিফিকেশন অ্যাকশন (Accept / Reject)
@router.post("/verifications/{user_id}")
def process_verification(user_id: int, payload: VerificationActionRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ইউজার পাওয়া যায়নি!")

    action = payload.action.lower()
    if action == "accept":
        user.status = UserStatus.ACTIVE
    elif action == "reject":
        user.status = UserStatus.BANNED # অথবা রিজেক্ট হলে ব্যান করা যেতে পারে
    else:
        raise HTTPException(status_code=400, detail="অমূল্য (Invalid) অ্যাকশন!")

    db.commit()
    return {"message": f"ইউজার সফলভাবে {action} করা হয়েছে!"}


# ৪. কনটেন্ট মডারেশন (Notes & Questions - Pending, Active, Rejected সব দেখার জন্য)
@router.get("/notes/moderation")
def get_notes_moderation(db: Session = Depends(get_db)):
    notes = db.query(Note).all()
    result = []
    
    for n in notes:
        uploader = db.query(User).filter(User.id == n.user_id).first()
        uploader_name = uploader.name if uploader else "Unknown"
        
        result.append({
            "id": n.id,
            "title": n.title,
            "note_type": n.note_type,
            "status": n.status or "pending", # 'pending', 'active', 'rejected'
            "user_id": n.user_id,
            "uploader_name": uploader_name,
            "reason": n.description or "Pending Review",
            "file_path": n.file_path,
            "created_at": getattr(n, "created_at", None)
        })
    return result


# ৫. নোটস/কোশ্চেন স্ট্যাটাস আপডেট (Approve / Reject / Pending)
@router.put("/notes/{note_id}/status")
def update_note_status(note_id: int, payload: StatusUpdateRequest, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="নোট বা রিসোর্সটি পাওয়া যায়নি!")

    note.status = payload.status.lower() # 'active', 'rejected', 'pending'
    db.commit()
    return {"message": "নোটের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!"}


# ৬. ইউজার ম্যানেজমেন্ট (সব ইউজারের লিস্ট)
@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    result = []
    
    for u in users:
        dept = "CSE"
        if u.student_profile:
            dept = u.student_profile.department
            
        role_str = u.role.value if hasattr(u.role, "value") else str(u.role)
        
        status_str = "Active"
        if u.status == UserStatus.BANNED or u.status == UserStatus.PENDING:
            status_str = "Suspended"

        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": role_str.capitalize(),
            "status": status_str,
            "department": dept
        })
    return result


# ৭. ইউজার ব্যান বা আনব্যান করার রাউট
@router.put("/users/{user_id}/status")
def update_user_status(user_id: int, payload: StatusUpdateRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ইউজার পাওয়া যায়নি!")

    if payload.status.lower() == "active":
        user.status = UserStatus.ACTIVE
    else:
        user.status = UserStatus.BANNED

    db.commit()
    return {"message": "ইউজারের স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে!"}


# ৮. এলামনাই জব পোস্ট মডারেশন (Pending/Approved/Rejected Jobs)
@router.get("/jobs/moderation")
def get_jobs_moderation(db: Session = Depends(get_db)):
    # যদি JobPost মডেল প্রজেক্টে থেকে থাকে
    try:
        jobs = db.query(JobPost).all()
    except Exception:
        jobs = []

    result = []
    for j in jobs:
        poster = db.query(User).filter(User.id == j.user_id).first() if hasattr(j, "user_id") else None
        poster_name = poster.name if poster else "Alumni"

        result.append({
            "id": j.id,
            "title": j.title,
            "company_name": j.company_name,
            "location": j.location,
            "job_type": j.job_type,
            "status": j.status or "pending", # 'pending', 'active', 'rejected'
            "posted_by": f"{poster_name} (Alumni)",
            "description": j.description,
            "created_at": getattr(j, "created_at", None)
        })
    return result


# ৯. জব পোস্ট স্ট্যাটাস আপডেট (Approve / Reject / Pending)
@router.put("/jobs/{job_id}/status")
def update_job_status(job_id: int, payload: StatusUpdateRequest, db: Session = Depends(get_db)):
    try:
        job = db.query(JobPost).filter(JobPost.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="জব পোস্টটি পাওয়া যায়নি!")

        job.status = payload.status.lower() # 'active', 'rejected', 'pending'
        db.commit()
        return {"message": "জব পোস্টের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))