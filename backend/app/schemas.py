from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, time, datetime
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
    MentorshipStatus,
    EventStatus,        # ইভেন্ট স্ট্যাটাস (Draft / Published)
    AttendanceStatus    # চেক-ইন স্ট্যাটাস
)

# ==============================================================================
# 1. COMMON & AUTHENTICATION SCHEMAS
# ==============================================================================

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

# Common Payment Schemas
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


# ==============================================================================
# 2. STUDENT MODULE SCHEMAS
# ==============================================================================

# --- Student Profile ---
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

# --- Student Academic Notes & Questions ---
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

class NoteRatingCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)

class NoteRatingResponse(NoteRatingCreate):
    id: int
    note_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Student Mentorship Request ---
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

# --- Student Job Application ---
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

# --- Student Event Registration ---
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
    ticket_number: Optional[str] = None
    attendance_status: AttendanceStatus
    paid_amount: float
    registered_at: datetime

    class Config:
        from_attributes = True


# ==============================================================================
# 3. ALUMNI MODULE SCHEMAS
# ==============================================================================

# --- Alumni Profile ---
class AlumniProfileCreate(BaseModel):
    passing_year: int
    current_job_title: Optional[str] = None
    company: Optional[str] = None
    linkedin_url: Optional[str] = None

class AlumniProfileUpdate(BaseModel):
    current_job_title: Optional[str] = None
    company: Optional[str] = None
    linkedin_url: Optional[str] = None

class AlumniProfileResponse(AlumniProfileCreate):
    id: int
    user_id: int
    profile_pic: Optional[str] = None
    alumni_id_card: Optional[str] = None

    class Config:
        from_attributes = True

# --- Alumni Mentorship Availability Slots ---
class MentorshipSlotCreate(BaseModel):
    available_date: date
    start_time: time
    end_time: time

class MentorshipSlotResponse(MentorshipSlotCreate):
    id: int
    alumni_id: int
    is_booked: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Alumni Reviewing Mentorship Requests ---
class MentorshipStatusUpdate(BaseModel):
    status: MentorshipStatus

class MentorshipRequestDetailResponse(BaseModel):
    id: int
    student_id: int
    student_name: str
    student_email: str
    preferred_date: date
    message: Optional[str] = None
    status: MentorshipStatus
    created_at: datetime

    class Config:
        from_attributes = True

# --- Alumni Job Opportunities & Application Review ---
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

class JobApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus

class JobApplicationDetailResponse(BaseModel):
    id: int
    job_id: int
    applicant_id: int
    applicant_name: str
    applicant_email: str
    resume_path: str
    cover_letter: Optional[str] = None
    status: ApplicationStatus
    applied_at: datetime

    class Config:
        from_attributes = True


# ==============================================================================
# 4. CLUB MODULE SCHEMAS
# ==============================================================================

# --- Club Profile & Registration ---
class ClubCreate(BaseModel):
    club_name: str
    description: Optional[str] = None

class ClubResponse(ClubCreate):
    id: int
    lead_user_id: int
    approval_document: Optional[str] = None

    class Config:
        from_attributes = True

# --- Club Events Management ---
class EventCreate(BaseModel):
    event_title: str
    venue: Optional[str] = None
    event_date: date
    start_time: Optional[str] = None
    deadline: Optional[date] = None
    seat_limit: int = 50
    registration_fee: float = 0.00
    description: Optional[str] = None
    status: Optional[EventStatus] = EventStatus.DRAFT

class EventResponse(EventCreate):
    id: int
    club_id: int
    banner_url: Optional[str] = None
    approval_copy: Optional[str] = None
    status: EventStatus
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ==============================================================================
# 5. ADMIN MODULE SCHEMAS (Moderation & Approvals)
# ==============================================================================

class UserStatusUpdate(BaseModel):
    status: UserStatus

class NoteStatusUpdate(BaseModel):
    status: NoteStatus

class JobStatusUpdate(BaseModel):
    status: JobStatus