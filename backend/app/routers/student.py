from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
from datetime import date

from app.database import get_db
from app.models import (
    JobType, User, UserStatus, StudentProfile, Note, NoteType, Event, EventRegistration, 
    RegistrationType, Payment, PaymentStatus, JobPost, JobApplication
)
from app.schemas import (
    JobPostResponse, StudentProfileCreate, StudentProfileResponse, 
    NoteCreate, NoteResponse, 
    EventResponse,  
    EventRegistrationCreate, EventRegistrationResponse,
    JobApplicationResponse
)

router = APIRouter(
    prefix="/student",
    tags=["Student Dashboard"]
)

# আপলোড করা ফাইল সেভ করার ফোল্ডার
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# হেল্পার ফাংশন: ইউজার স্ট্যাটাস চেক করার জন্য (Pending বা Banned হলে রিকোয়েস্ট ব্লক করবে)
def verify_user_status(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.status == UserStatus.BANNED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="আপনার অ্যাকাউন্টটি ব্যান করা হয়েছে! আপনি কোনো কার্যক্রম চালাতে পারবেন না।"
        )
    
    if user.status == UserStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="আপনার অ্যাকাউন্টটি এখনো এডমিন কর্তৃক অনুমোদিত (Pending) হয়নি!"
        )
    return user


# ১. স্টুডেন্ট প্রোফাইল তৈরি বা আপডেট করা (আইডি কার্ড সহ)
@router.post("/profile", response_model=StudentProfileResponse)
def create_or_update_student_profile(
    student_id: str = Form(...),
    department: str = Form(...),
    batch: str = Form(...),
    semester: str = Form(...),
    profile_pic: Optional[UploadFile] = File(None),
    student_id_card: Optional[UploadFile] = File(None),
    user_id: int = Form(...), 
    db: Session = Depends(get_db)
):
    # ইউজার স্ট্যাটাস চেক (Pending বা Banned কি না)
    verify_user_status(user_id, db)

    profile_pic_path = None
    id_card_path = None

    # প্রফাইল পিকচার সেভ করা
    if profile_pic:
        pic_filename = f"profile_{user_id}_{profile_pic.filename}"
        pic_path = os.path.join(UPLOAD_DIR, pic_filename)
        with open(pic_path, "wb") as buffer:
            shutil.copyfileobj(profile_pic.file, buffer)
        profile_pic_path = pic_path

    # স্টুডেন্ট আইডি কার্ড সেভ করা
    if student_id_card:
        card_filename = f"idcard_{user_id}_{student_id_card.filename}"
        card_path = os.path.join(UPLOAD_DIR, card_filename)
        with open(card_path, "wb") as buffer:
            shutil.copyfileobj(student_id_card.file, buffer)
        id_card_path = card_path

    # পূর্বের প্রফাইল আছে কিনা চেক করা
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    
    if profile:
        profile.student_id = student_id
        profile.department = department
        profile.batch = batch
        profile.semester = semester
        if profile_pic_path:
            profile.profile_pic = profile_pic_path
        if id_card_path:
            profile.student_id_card = id_card_path
    else:
        profile = StudentProfile(
            user_id=user_id,
            student_id=student_id,
            department=department,
            batch=batch,
            semester=semester,
            profile_pic=profile_pic_path,
            student_id_card=id_card_path
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)
    return profile


# ২. নোট বা প্রশ্ন আপলোড করা
@router.post("/notes/upload", response_model=NoteResponse)
def upload_note(
    title: str = Form(...),
    department: str = Form(...),
    course_code: str = Form(...),
    note_type: NoteType = Form(NoteType.NOTES),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    user_id: int = Form(...),
    db: Session = Depends(get_db)
):
    # ইউজার স্ট্যাটাস চেক
    verify_user_status(user_id, db)

    file_filename = f"note_{user_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, file_filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_note = Note(
        user_id=user_id,
        title=title,
        department=department,
        course_code=course_code,
        note_type=note_type,
        file_path=file_path,
        description=description
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


# ৩. ইভেন্টে রেজিস্ট্রেশন করা (ফ্রি অথবা পেইড)
@router.post("/events/register", response_model=EventRegistrationResponse)
def register_for_event(
    registration: EventRegistrationCreate,
    user_id: int, 
    db: Session = Depends(get_db)
):
    # ইউজার স্ট্যাটাস চেক
    verify_user_status(user_id, db)

    event = db.query(Event).filter(Event.id == registration.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # সিট লিমিট চেক করা
    registered_count = db.query(EventRegistration).filter(EventRegistration.event_id == registration.event_id).count()
    if registered_count >= event.seat_limit:
        raise HTTPException(status_code=400, detail="Event registration is full (Seat limit reached)")

    payment_id = None
    payment_status = PaymentStatus.FREE

    # যদি ইভেন্ট পেইড হয়
    if registration.registration_type == RegistrationType.PAID:
        if not registration.transaction_id or not registration.payment_method:
            raise HTTPException(status_code=400, detail="Transaction ID and Payment Method are required for paid events")
        
        # পেমেন্ট রেকর্ড তৈরি
        new_payment = Payment(
            user_id=user_id,
            amount=event.registration_fee,
            transaction_id=registration.transaction_id,
            payment_method=registration.payment_method,
            status=PaymentStatus.PENDING
        )
        db.add(new_payment)
        db.commit()
        db.refresh(new_payment)

        payment_id = new_payment.id
        payment_status = PaymentStatus.PENDING

    # ইভেন্ট রেজিস্ট্রেশন রেকর্ড তৈরি
    new_registration = EventRegistration(
        event_id=registration.event_id,
        user_id=user_id,
        payment_id=payment_id,
        registration_type=registration.registration_type,
        payment_status=payment_status
    )

    db.add(new_registration)
    db.commit()
    db.refresh(new_registration)
    return new_registration


# ৪. অ্যালুনিদের পোস্ট করা জবে সিভি দিয়ে এপ্লাই করা
@router.post("/jobs/{job_id}/apply", response_model=JobApplicationResponse)
def apply_for_job(
    job_id: int,
    user_id: int = Form(...),
    cover_letter: Optional[str] = Form(None),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # ইউজার স্ট্যাটাস চেক
    verify_user_status(user_id, db)

    job = db.query(JobPost).filter(JobPost.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job post not found")

    # সিভি ফাইল সেভ করা
    resume_filename = f"resume_{user_id}_{resume.filename}"
    resume_path = os.path.join(UPLOAD_DIR, resume_filename)
    with open(resume_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)

    # আগে এপ্লাই করেছে কিনা চেক করা
    existing_app = db.query(JobApplication).filter(
        JobApplication.job_id == job_id, 
        JobApplication.user_id == user_id
    ).first()
    if existing_app:
        raise HTTPException(status_code=400, detail="You have already applied for this job")

    new_application = JobApplication(
        job_id=job_id,
        user_id=user_id,
        resume_path=resume_path,
        cover_letter=cover_letter
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application


# ৫. সকল নোট বা প্রশ্ন লিস্ট আকারে দেখা (ডিপার্টমেন্ট বা কোর্স কোড দিয়ে ফিল্টার করার সুবিধা সহ)
@router.get("/notes", response_model=List[NoteResponse])
def get_all_notes(
    department: Optional[str] = None,
    course_code: Optional[str] = None,
    note_type: Optional[NoteType] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Note)
    
    if department:
        query = query.filter(Note.department.ilike(f"%{department}%"))
    if course_code:
        query = query.filter(Note.course_code.ilike(f"%{course_code}%"))
    if note_type:
        query = query.filter(Note.note_type == note_type)
        
    notes = query.order_by(Note.created_at.desc()).all()
    return notes


# ৬. সকল জব পোস্ট লিস্ট আকারে দেখা (লোকেশন বা জব টাইপ দিয়ে ফিল্টার করার সুবিধা সহ)
@router.get("/jobs", response_model=List[JobPostResponse])
def get_all_jobs(
    location: Optional[str] = None,
    job_type: Optional[JobType] = None,
    company_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(JobPost)
    
    if location:
        query = query.filter(JobPost.location.ilike(f"%{location}%"))
    if job_type:
        query = query.filter(JobPost.job_type == job_type)
    if company_name:
        query = query.filter(JobPost.company_name.ilike(f"%{company_name}%"))
        
    jobs = query.order_by(JobPost.created_at.desc()).all()
    return jobs


# ৭. আপকামিং ইভেন্টগুলোর তালিকা দেখা
@router.get("/events/upcoming", response_model=List[EventResponse])
def get_upcoming_events(
    club_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    current_date = date.today()
    
    query = db.query(Event).filter(Event.event_date >= current_date)
    
    if club_id:
        query = query.filter(Event.club_id == club_id)
        
    upcoming_events = query.order_by(Event.event_date.asc()).all()
    return upcoming_events