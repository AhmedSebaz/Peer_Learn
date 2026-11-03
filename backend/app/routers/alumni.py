from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import (
    User, UserRole, UserStatus, AlumniProfile, 
    JobPost, JobApplication, ApplicationStatus, 
    AlumniMentorshipRequest, MentorshipStatus, MentorshipSlot
)
from app.schemas import (
    MentorshipSlotCreate,
    MentorshipSlotResponse,
    AlumniProfileUpdate,
    JobApplicationStatusUpdate, 
    MentorshipStatusUpdate,
    JobApplicationDetailResponse, 
    MentorshipRequestDetailResponse,
    JobPostCreate,
    JobPostResponse
)
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/alumni", tags=["Alumni Operations"])

# Alumni Role Verification Helper
def verify_alumni(current_user: User):
    # if current_user.role != UserRole.ALUMNI or current_user.status != UserStatus.ACTIVE:
    #     # raise HTTPException(
    #     #     status_code=status.HTTP_403_FORBIDDEN,
    #     #     detail="অ্যাক্সেস ডিনাইড! শুধুমাত্র অ্যাক্টিভ অ্যালামনাই এই সুবিধা ব্যবহার করতে পারবেন।"
    #     # )
    return current_user

# ==========================================
# 1. PROFILE MANAGEMENT
# ==========================================
# নতুন GET রাউট (ফ্রন্টএন্ডে ডাটা দেখানোর জন্য)
@router.get("/profile")
def get_alumni_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_alumni(current_user)
    
    profile = db.query(AlumniProfile).filter(AlumniProfile.user_id == current_user.id).first()
    
    return {
        "name": current_user.name,
        "email": current_user.email,
        "passing_year": profile.passing_year if profile else "N/A",
        "current_job_title": profile.current_job_title if profile else "Not Specified",
        "company": profile.company if profile else "Not Specified",
        "linkedin_url": profile.linkedin_url if profile else ""
    }

@router.put("/profile", response_model=dict)
def update_alumni_profile(
    profile_data: AlumniProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_alumni(current_user)
    
    profile = db.query(AlumniProfile).filter(AlumniProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="প্রোফাইল খুঁজে পাওয়া যায়নি!")

    if profile_data.current_job_title is not None:
        profile.current_job_title = profile_data.current_job_title
    if profile_data.company is not None:
        profile.company = profile_data.company
    if profile_data.linkedin_url is not None:
        profile.linkedin_url = profile_data.linkedin_url

    db.commit()
    db.refresh(profile)
    return {"message": "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!"}

# ==========================================
# 2. MENTORSHIP SLOTS (Create & View)
# ==========================================

@router.post("/slots", response_model=MentorshipSlotResponse, status_code=status.HTTP_201_CREATED)
def add_mentorship_slot(
    slot_data: MentorshipSlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_alumni(current_user)

    new_slot = MentorshipSlot(
        alumni_id=current_user.id,
        available_date=slot_data.available_date,
        start_time=slot_data.start_time,
        end_time=slot_data.end_time,
        is_booked=False
    )
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.get("/slots", response_model=List[MentorshipSlotResponse])
def get_my_slots(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_alumni(current_user)
    return db.query(MentorshipSlot).filter(MentorshipSlot.alumni_id == current_user.id).all()

# ==========================================
# 3. MENTORSHIP REQUESTS (View & Respond)
# ==========================================

@router.get("/mentorship-requests", response_model=List[MentorshipRequestDetailResponse])
def view_mentorship_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_alumni(current_user)

    requests = db.query(AlumniMentorshipRequest).filter(
        AlumniMentorshipRequest.alumni_id == current_user.id
    ).all()

    result = []
    for req in requests:
        result.append(MentorshipRequestDetailResponse(
            id=req.id,
            student_id=req.student.id,
            student_name=req.student.name,
            student_email=req.student.email,
            preferred_date=req.preferred_date,
            message=req.message,
            status=req.status.value,
            created_at=req.created_at
        ))
    return result

@router.patch("/mentorship-requests/{request_id}", response_model=dict)
def update_mentorship_status(
    request_id: int,
    payload: MentorshipStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_alumni(current_user)

    request_obj = db.query(AlumniMentorshipRequest).filter(
        AlumniMentorshipRequest.id == request_id,
        AlumniMentorshipRequest.alumni_id == current_user.id
    ).first()

    if not request_obj:
        raise HTTPException(status_code=404, detail="মেন্টরশিপ রিকোয়েস্ট পাওয়া যায়নি!")

    status_val = payload.status.lower()
    if status_val not in [MentorshipStatus.ACCEPTED.value, MentorshipStatus.REJECTED.value]:
        raise HTTPException(status_code=400, detail="ভুল স্ট্যাটাস! শুধুমাত্র accepted বা rejected দেওয়া যাবে।")

    request_obj.status = MentorshipStatus(status_val)
    db.commit()
    return {"message": f"মেন্টরশিপ রিকোয়েস্ট সফলভাবে {status_val} করা হয়েছে!"}

# ==========================================
# 4. JOB POSTING
# ==========================================

@router.post("/jobs", response_model=JobPostResponse, status_code=status.HTTP_201_CREATED)
def create_job_post(
    job_data: JobPostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # verify_alumni(current_user)  # টেস্টিংয়ের জন্য এটি কমেন্ট করা থাকতে পারে

    new_job = JobPost(
        alumni_user_id=current_user.id,
        job_title=job_data.job_title,
        company_name=job_data.company_name,
        location=job_data.location,
        job_type=job_data.job_type,
        description=job_data.description,
        application_link=job_data.application_link
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.get("/jobs", response_model=List[JobPostResponse])
def get_job_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # verify_alumni(current_user)  # টেস্টিংয়ের জন্য এটি কমেন্ট করা থাকতে পারে
    
    # Retrieve all job posts. If you want to filter by the current alumni, add a filter.
    jobs = db.query(JobPost).filter(JobPost.alumni_user_id == current_user.id).all()
    return jobs

# ==========================================
# 5. JOB APPLICATIONS (View & Update Status)
# ==========================================

@router.get("/jobs/{job_id}/applications", response_model=List[JobApplicationDetailResponse])
def view_job_applications(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # verify_alumni(current_user) # টেস্টিংয়ের জন্য এটি কমেন্ট করা থাকতে পারে

    # UPDATE: সাময়িকভাবে alumni_user_id চেকটি সরিয়ে দেওয়া হলো
    job = db.query(JobPost).filter(
        JobPost.id == job_id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="জব পোস্টটি খুঁজে পাওয়া যায়নি!")

    applications = db.query(JobApplication).filter(JobApplication.job_id == job_id).all()

    result = []
    for app in applications:
        result.append(JobApplicationDetailResponse(
            id=app.id,
            job_id=app.job_id,
            applicant_id=app.applicant.id,
            applicant_name=app.applicant.name,
            applicant_email=app.applicant.email,
            resume_path=app.resume_path,
            cover_letter=app.cover_letter,
            status=app.status.value if hasattr(app.status, 'value') else app.status,
            applied_at=app.applied_at
        ))
    return result

@router.patch("/applications/{application_id}/status", response_model=dict)
def update_application_status(
    application_id: int,
    payload: JobApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # verify_alumni(current_user) # টেস্টিংয়ের জন্য এটি কমেন্ট করা থাকতে পারে

    # UPDATE: সাময়িকভাবে alumni_user_id চেকটি সরিয়ে দেওয়া হলো
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id
    ).first()

    if not application:
        raise HTTPException(status_code=404, detail="অ্যাপ্লিকেশন খুঁজে পাওয়া যায়নি!")

    # Check if payload.status is a string or Enum and convert accordingly
    status_val = payload.status.value.lower() if hasattr(payload.status, 'value') else payload.status.lower()
    
    if status_val not in [ApplicationStatus.SHORTLISTED.value, ApplicationStatus.REJECTED.value, ApplicationStatus.REVIEWED.value]:
        raise HTTPException(status_code=400, detail="ভুল স্ট্যাটাস! শুধুমাত্র shortlisted, reviewed বা rejected দেওয়া যাবে।")

    application.status = ApplicationStatus(status_val)
    db.commit()
    return {"message": f"অ্যাপ্লিকেশন সফলভাবে {status_val} করা হয়েছে!"}