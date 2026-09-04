from sqlalchemy import Column, Integer, String, Text, DECIMAL, Enum, TIMESTAMP, ForeignKey, CheckConstraint, Date, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    ADMIN = "admin"
    ALUMNI = "alumni"
    CLUB_LEAD = "club_lead"

class UserStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    BANNED = "banned"

class NoteType(str, enum.Enum):
    NOTES = "notes"
    QUESTION = "question"

class NoteStatus(str, enum.Enum):
    ACTIVE = "active"
    DELETED_BY_USER = "deleted_by_user"
    DELETED_BY_ADMIN = "deleted_by_admin"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    FREE = "free"

class RegistrationType(str, enum.Enum):
    FREE = "free"
    PAID = "paid"

class JobType(str, enum.Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    INTERNSHIP = "internship"
    CONTRACT = "contract"

class JobStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"

class MentorshipStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT)
    status = Column(Enum(UserStatus), default=UserStatus.PENDING)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete")
    alumni_profile = relationship("AlumniProfile", back_populates="user", uselist=False, cascade="all, delete")
    clubs = relationship("Club", back_populates="lead_user", cascade="all, delete")
    admin_logs = relationship("AdminLog", back_populates="admin", cascade="all, delete")
    payments = relationship("Payment", back_populates="user", cascade="all, delete")
    notes = relationship("Note", back_populates="user", cascade="all, delete")
    ratings = relationship("NoteRating", back_populates="user", cascade="all, delete")
    event_registrations = relationship("EventRegistration", back_populates="user", cascade="all, delete")
    job_posts = relationship("JobPost", back_populates="alumni", cascade="all, delete")
    job_applications = relationship("JobApplication", back_populates="applicant", cascade="all, delete")
    
    # Mentorship Relationships
    sent_mentorship_requests = relationship("AlumniMentorshipRequest", foreign_keys="[AlumniMentorshipRequest.student_id]", back_populates="student", cascade="all, delete")
    received_mentorship_requests = relationship("AlumniMentorshipRequest", foreign_keys="[AlumniMentorshipRequest.alumni_id]", back_populates="alumni", cascade="all, delete")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(String(50), unique=True, nullable=False)
    department = Column(String(100), nullable=False)
    batch = Column(String(50), nullable=False)
    semester = Column(String(20), nullable=False)
    profile_pic = Column(String(255), nullable=True)
    student_id_card = Column(String(255), nullable=True)

    user = relationship("User", back_populates="student_profile")


class Club(Base):
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    club_name = Column(String(100), nullable=False)
    lead_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=True)

    lead_user = relationship("User", back_populates="clubs")
    events = relationship("Event", back_populates="club", cascade="all, delete")


class AlumniProfile(Base):
    __tablename__ = "alumni_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    passing_year = Column(Integer, nullable=False)
    current_job_title = Column(String(150), nullable=True)
    company = Column(String(150), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
    alumni_id_card = Column(String(255), nullable=True)

    user = relationship("User", back_populates="alumni_profile")


class AdminLog(Base):
    __tablename__ = "admin_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    admin_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action_performed = Column(Text, nullable=False)
    timestamp = Column(TIMESTAMP, server_default=func.current_timestamp())

    admin = relationship("User", back_populates="admin_logs")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    transaction_id = Column(String(100), unique=True, nullable=False)
    payment_method = Column(String(50), nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    user = relationship("User", back_populates="payments")
    event_registrations = relationship("EventRegistration", back_populates="payment")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(150), nullable=False)
    department = Column(String(100), nullable=False)
    course_code = Column(String(50), nullable=False)
    note_type = Column(Enum(NoteType), default=NoteType.NOTES, nullable=False)
    file_path = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    rating = Column(DECIMAL(3, 2), default=0.00)
    total_ratings = Column(Integer, default=0)
    status = Column(Enum(NoteStatus), default=NoteStatus.ACTIVE, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    user = relationship("User", back_populates="notes")
    note_ratings = relationship("NoteRating", back_populates="note", cascade="all, delete")


class NoteRating(Base):
    __tablename__ = "note_ratings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    note_id = Column(Integer, ForeignKey("notes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    __table_args__ = (
        CheckConstraint('rating BETWEEN 1 AND 5', name='check_rating_range'),
    )

    note = relationship("Note", back_populates="note_ratings")
    user = relationship("User", back_populates="ratings")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    club_id = Column(Integer, ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)
    event_title = Column(String(150), nullable=False)
    event_date = Column(Date, nullable=False)
    seat_limit = Column(Integer, default=50, nullable=False)
    registration_fee = Column(DECIMAL(10, 2), default=0.00)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    club = relationship("Club", back_populates="events")
    registrations = relationship("EventRegistration", back_populates="event", cascade="all, delete")


class EventRegistration(Base):
    __tablename__ = "event_registrations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    payment_id = Column(Integer, ForeignKey("payments.id", ondelete="SET NULL"), nullable=True)
    registration_type = Column(Enum(RegistrationType), default=RegistrationType.FREE)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.FREE)
    transaction_id = Column(String(100), nullable=True)
    payment_method = Column(String(50), nullable=True)
    registered_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    event = relationship("Event", back_populates="registrations")
    user = relationship("User", back_populates="event_registrations")
    payment = relationship("Payment", back_populates="event_registrations")


class JobPost(Base):
    __tablename__ = "job_posts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    alumni_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_title = Column(String(150), nullable=False)
    company_name = Column(String(150), nullable=False)
    location = Column(String(100), nullable=False)
    job_type = Column(Enum(JobType), default=JobType.FULL_TIME, nullable=False)
    description = Column(Text, nullable=False)
    application_link = Column(String(255), nullable=False)
    status = Column(Enum(JobStatus), default=JobStatus.PENDING, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    alumni = relationship("User", back_populates="job_posts")
    applications = relationship("JobApplication", back_populates="job", cascade="all, delete")


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey("job_posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_path = Column(String(255), nullable=False)
    cover_letter = Column(Text, nullable=True)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING, nullable=False)
    applied_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    job = relationship("JobPost", back_populates="applications")
    applicant = relationship("User", back_populates="job_applications")


class AlumniMentorshipRequest(Base):
    __tablename__ = "alumni_mentorship_requests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    alumni_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    preferred_date = Column(Date, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(Enum(MentorshipStatus), default=MentorshipStatus.PENDING, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    student = relationship("User", foreign_keys=[student_id], back_populates="sent_mentorship_requests")
    alumni = relationship("User", foreign_keys=[alumni_id], back_populates="received_mentorship_requests")