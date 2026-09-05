from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime
from app.models import (
    UserRole, 
    UserStatus, 
    NoteType, 
    NoteStatus, 
    PaymentStatus, 
    RegistrationType, 
    JobType, 
    JobStatus, 
    ApplicationStatus, 
    MentorshipStatus
)

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.STUDENT

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    status: UserStatus
    created_at: datetime

    class Config:
        from_attributes = True


# --- Student Profile Schemas ---
class StudentProfileCreate(BaseModel):
    student_id: Optional[str] = None
    department: str
    batch: str
    semester: str
    linkedin: Optional[str] = None
    bio: Optional[str] = None

class StudentProfileResponse(StudentProfileCreate):
    id: int
    user_id: int
    profile_pic: Optional[str] = None
    student_id_card: Optional[str] = None

    class Config:
        from_attributes = True

# --- Alumni Profile Schemas ---
class AlumniProfileCreate(BaseModel):
    passing_year: int
    current_job_title: Optional[str] = None
    company: Optional[str] = None
    linkedin_url: Optional[str] = None

class AlumniProfileResponse(AlumniProfileCreate):
    id: int
    user_id: int
    profile_pic: Optional[str] = None  # <-- অ্যালুনি প্রফাইল পিকচার ফিল্ড যুক্ত করা হলো
    alumni_id_card: Optional[str] = None

    class Config:
        from_attributes = True


# --- Club Schemas ---
class ClubCreate(BaseModel):
    club_name: str
    description: Optional[str] = None

class ClubResponse(ClubCreate):
    id: int
    lead_user_id: int

    class Config:
        from_attributes = True


# --- Notes & Questions Schemas ---
class NoteCreate(BaseModel):
    title: str
    department: str
    course_code: str
    note_type: NoteType = NoteType.NOTES
    description: Optional[str] = None

class NoteResponse(NoteCreate):
    id: int
    user_id: int
    file_path: str
    rating: float
    total_ratings: int
    status: NoteStatus
    created_at: datetime

    class Config:
        from_attributes = True


# --- Note Rating Schemas ---
class NoteRatingCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)

class NoteRatingResponse(NoteRatingCreate):
    id: int
    note_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Payment Schemas ---
class PaymentCreate(BaseModel):
    amount: float
    transaction_id: str
    payment_method: str

class PaymentResponse(PaymentCreate):
    id: int
    user_id: int
    status: PaymentStatus
    created_at: datetime

    class Config:
        from_attributes = True


# --- Event Schemas ---
class EventCreate(BaseModel):
    event_title: str
    event_date: date
    seat_limit: int = 50
    registration_fee: float = 0.00
    description: Optional[str] = None

class EventResponse(EventCreate):
    id: int
    club_id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class EventRegistrationCreate(BaseModel):
    event_id: int
    registration_type: RegistrationType = RegistrationType.FREE
    transaction_id: Optional[str] = None
    payment_method: Optional[str] = None
    amount: Optional[float] = 0.00

class EventRegistrationResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    registration_type: RegistrationType
    payment_status: PaymentStatus
    transaction_id: Optional[str] = None
    payment_method: Optional[str] = None
    registered_at: datetime

    class Config:
        from_attributes = True


# --- Job Post Schemas ---
class JobPostCreate(BaseModel):
    job_title: str
    company_name: str
    location: str
    job_type: JobType = JobType.FULL_TIME
    description: str
    application_link: str

class JobPostResponse(JobPostCreate):
    id: int
    alumni_user_id: int
    status: JobStatus
    created_at: datetime

    class Config:
        from_attributes = True


# --- Job Application Schemas ---
class JobApplicationCreate(BaseModel):
    cover_letter: Optional[str] = None

class JobApplicationResponse(JobApplicationCreate):
    id: int
    job_id: int
    user_id: int
    resume_path: str
    status: ApplicationStatus
    applied_at: datetime

    class Config:
        from_attributes = True


# --- Alumni Mentorship Request Schemas ---
class MentorshipRequestCreate(BaseModel):
    alumni_id: int
    preferred_date: date
    message: Optional[str] = None

class MentorshipRequestResponse(MentorshipRequestCreate):
    id: int
    student_id: int
    status: MentorshipStatus
    created_at: datetime

    class Config:
        from_attributes = True