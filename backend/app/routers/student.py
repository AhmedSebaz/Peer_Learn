from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
from datetime import date

from app.database import get_db
from app.models import (
    JobType, User, UserRole, UserStatus, StudentProfile, AlumniProfile, Note, NoteType, NoteStatus, NoteRating, 
    Event, EventRegistration, RegistrationType, Payment, PaymentStatus, JobPost, JobApplication, AlumniMentorshipRequest, MentorshipStatus
)
from app.schemas import (
    JobPostResponse, StudentProfileCreate, StudentProfileResponse, 
    NoteCreate, NoteResponse, 
    EventResponse,  
    EventRegistrationCreate, EventRegistrationResponse,
    JobApplicationResponse, NoteRatingCreate, NoteRatingResponse, MentorshipRequestCreate, MentorshipRequestResponse
)

router = APIRouter(
    prefix="/student",
    tags=["Student Dashboard"]
)

# আপলোড করা ফাইল সেভ করার ফোল্ডার
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# হেল্পার ফাংশন: ইউজার স্ট্যাটাস চেক করার জন্য (Pending বা Banned হলে রিকোয়েস্ট ব্লক করবে)
def verify_user_status(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.status == UserStatus.BANNED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="আপনার অ্যাকাউন্টটি ব্যান করা হয়েছে! আপনি কোনো কার্যক্রম চালাতে পারবেন না।"
        )
    
    if user.status == UserStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="আপনার অ্যাকাউন্টটি এখনো এডমিন কর্তৃক অনুমোদিত (Pending) হয়নি!"
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
    verify_user_status(user_id, db)

    profile_pic_path = None
    id_card_path = None

    if profile_pic:
        pic_filename = f"profile_{user_id}_{profile_pic.filename}"
        pic_path = os.path.join(UPLOAD_DIR, pic_filename)
        with open(pic_path, "wb") as buffer:
            shutil.copyfileobj(profile_pic.file, buffer)
        profile_pic_path = pic_path

    if student_id_card:
        card_filename = f"idcard_{user_id}_{student_id_card.filename}"
        card_path = os.path.join(UPLOAD_DIR, card_filename)
        with open(card_path, "wb") as buffer:
            shutil.copyfileobj(student_id_card.file, buffer)
        id_card_path = card_path

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


# ২. নোট বা প্রশ্ন আপলোড করা (ডিফল্ট স্ট্যাটাস pending থাকবে)
@router.post("/notes/upload", response_model=NoteResponse)
def upload_note(
    title: str = Form(...),
    department: str = Form(...),
    course_code: Optional[str] = Form(None),
    course: Optional[str] = Form(None),
    note_type: Optional[str] = Form("NOTES"),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    user_id: int = Form(...),
    db: Session = Depends(get_db)
):
    verify_user_status(user_id, db)

    final_course_code = course_code or course or "CSE-3201"
    
    # নোট টাইপ নিশ্চিত করা যাতে বড় হাতের বা সঠিক ফরম্যাটে সেভ হয়
    clean_note_type = (note_type or "NOTES").upper()
    if clean_note_type not in ["NOTES", "QUESTION", "QUESTIONS"]:
        clean_note_type = "NOTES"

    file_filename = f"note_{user_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, file_filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_note = Note(
        user_id=user_id,
        title=title,
        department=department,
        course_code=final_course_code,
        note_type=clean_note_type,
        file_path=file_path,
        description=description,
        status="pending" 
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


# ২.ক. রিসোর্স বা নোট ডিলিট করা
@router.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return {"message": "Resource deleted successfully"}


# ২.খ. নোট বা রিসোর্সে রেটিং সাবমিট করা এবং এভারেজ ক্যালকুলেট করা
@router.post("/notes/{note_id}/rate", response_model=NoteRatingResponse)
def rate_note(
    note_id: int,
    rating_data: NoteRatingCreate,
    user_id: int = Form(...),
    db: Session = Depends(get_db)
):
    verify_user_status(user_id, db)

    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    # ইউজার ইতিমধ্যে রেট করেছে কিনা চেক করা
    existing_rating = db.query(NoteRating).filter(
        NoteRating.note_id == note_id,
        NoteRating.user_id == user_id
    ).first()

    if existing_rating:
        existing_rating.rating = rating_data.rating
    else:
        new_rating = NoteRating(
            note_id=note_id,
            user_id=user_id,
            rating=rating_data.rating
        )
        db.add(new_rating)

    db.commit()

    # এভারেজ রেটিং এবং মোট রেটিং সংখ্যা আপডেট করা
    all_ratings = db.query(NoteRating).filter(NoteRating.note_id == note_id).all()
    total_count = len(all_ratings)
    avg_score = sum([r.rating for r in all_ratings]) / total_count if total_count > 0 else 0.0

    note.rating = round(avg_score, 2)
    note.total_ratings = total_count
    db.commit()
    db.refresh(note)

    return existing_rating if existing_rating else new_rating


# ৩. ইভেন্টে রেজিস্ট্রেশন করা (ফ্রি অথবা পেইড)
@router.post("/events/register", response_model=EventRegistrationResponse)
def register_for_event(
    registration: EventRegistrationCreate,
    user_id: int, 
    db: Session = Depends(get_db)
):
    verify_user_status(user_id, db)

    event = db.query(Event).filter(Event.id == registration.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    registered_count = db.query(EventRegistration).filter(EventRegistration.event_id == registration.event_id).count()
    if registered_count >= event.seat_limit:
        raise HTTPException(status_code=400, detail="Event registration is full (Seat limit reached)")

    payment_id = None
    payment_status = PaymentStatus.FREE

    if registration.registration_type == RegistrationType.PAID:
        if not registration.transaction_id or not registration.payment_method:
            raise HTTPException(status_code=400, detail="Transaction ID and Payment Method are required for paid events")
        
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
    verify_user_status(user_id, db)

    job = db.query(JobPost).filter(JobPost.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job post not found")

    resume_filename = f"resume_{user_id}_{resume.filename}"
    resume_path = os.path.join(UPLOAD_DIR, resume_filename)
    with open(resume_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)

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


# ৬. সকল জব পোস্ট লিস্ট আকারে দেখা
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


# ৮. মেন্টরশিপের জন্য অ্যালুনিদের তালিকা দেখা
@router.get("/mentors")
def get_all_mentors(db: Session = Depends(get_db)):
    alumni_users = db.query(User).filter(User.role == UserRole.ALUMNI, User.status == UserStatus.ACTIVE).all()
    
    mentors_list = []
    for alum in alumni_users:
        profile = db.query(AlumniProfile).filter(AlumniProfile.user_id == alum.id).first()
        mentors_list.append({
            "id": alum.id,
            "name": alum.name,
            "role": profile.current_job_title if profile else "Alumni Mentor",
            "company": profile.company if profile else "Tech Industry",
            "rating": 4.9,
            "bio": "Experienced professional ready to guide students in career paths and technical problem solving.",
            "slots": ["10:00 AM", "02:00 PM", "04:30 PM"]
        })
    return mentors_list


# ৯. অ্যালুনির মেন্টরশিপ স্লট বুক বা রিকোয়েস্ট পাঠানোর এন্ডপয়েন্ট
@router.post("/mentors/book", response_model=MentorshipRequestResponse)
def book_mentorship_slot(
    request_data: MentorshipRequestCreate,
    user_id: int = Form(...),
    db: Session = Depends(get_db)
):
    verify_user_status(user_id, db)

    new_request = AlumniMentorshipRequest(
        student_id=user_id,
        alumni_id=request_data.alumni_id,
        preferred_date=request_data.preferred_date,
        message=request_data.message,
        status=MentorshipStatus.PENDING
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request