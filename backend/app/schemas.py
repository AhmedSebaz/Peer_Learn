from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime
from app.models import UserRole, NoteType, PaymentStatus, RegistrationType, JobType, ApplicationStatus

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
    created_at: datetime

    class Config:
        from_attributes = True


# --- Student Profile Schemas ---
class StudentProfileCreate(BaseModel):
    student_id: str
    department: str
    batch: str
    semester: str

class StudentProfileResponse(StudentProfileCreate):
    id: int
    user_id: int
    profile_pic: Optional[str] = None
    student_id_card: Optional[str] = None

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
    registered_at: datetime

    class Config:
        from_attributes = True


# --- Job Post Schemas (স্টুডেন্টদের জব দেখার জন্য দরকার) ---
class JobPostCreate(BaseModel):
    job_title: str
    company_name: str
    location: str
    job_type: JobType = JobType.FULL_TIME
    description: str
    application_link: Optional[str] = None

class JobPostResponse(JobPostCreate):
    id: int
    alumni_id: int # রাউটারের সাথে মিলিয়ে ফিল্ড নাম ঠিক রাখা হয়েছে
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
    status: Optional[ApplicationStatus] = ApplicationStatus.PENDING
    applied_at: datetime

    class Config:
        from_attributes = True