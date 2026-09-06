from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
import shutil
import os
from app.database import get_db
from app.models import Event, EventRegistration, User, EventStatus, AttendanceStatus, PaymentStatus, StudentProfile
from app.schemas import EventCreate, EventResponse

router = APIRouter(prefix="/club-lead", tags=["Club Lead Dashboard"])

# ১. ক্লাব লিডারের সমস্ত সক্রিয় ইভেন্ট ফেচ করা
@router.get("/events/{club_id}")
def get_club_events(club_id: int, db: Session = Depends(get_db)):
    events = db.query(Event).filter(Event.club_id == club_id, Event.is_active == True).all()
    
    # ফ্রন্টএন্ড কম্পোনেন্টের সুবিধার জন্য প্রপার্টি ম্যাপিং
    result = []
    for ev in events:
        result.append({
            "id": ev.id,
            "event_title": ev.event_title,
            "title": ev.event_title, # Compatibility
            "venue": ev.venue,
            "event_date": str(ev.event_date),
            "date": str(ev.event_date), # Compatibility
            "start_time": ev.start_time,
            "time": ev.start_time, # Compatibility
            "deadline": str(ev.deadline) if ev.deadline else None,
            "seat_limit": ev.seat_limit,
            "limit": ev.seat_limit, # Compatibility
            "registration_fee": float(ev.registration_fee),
            "fee": float(ev.registration_fee), # Compatibility
            "description": ev.description,
            "banner_url": ev.banner_url,
            "status": ev.status.value if hasattr(ev.status, 'value') else ev.status,
            "registrations": len(ev.registrations)
        })
    return result

# ২. নতুন ইভেন্ট তৈরি করা (FormData এবং ব্যানার ইমেজ আপলোডসহ)
@router.post("/events", status_code=status.HTTP_201_CREATED)
def create_event(
    club_id: int = Form(...),
    event_title: str = Form(...),
    venue: str = Form(...),
    event_date: date = Form(...),
    start_time: str = Form(...),
    deadline: Optional[date] = Form(None),
    seat_limit: int = Form(50),
    registration_fee: float = Form(0.00),
    description: Optional[str] = Form(None),
    banner: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    banner_url = None
    if banner:
        upload_dir = "uploads/events"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, banner.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(banner.file, buffer)
        banner_url = f"/uploads/events/{banner.filename}"

    new_event = Event(
        club_id=club_id,
        event_title=event_title,
        venue=venue,
        event_date=event_date,
        start_time=start_time,
        deadline=deadline,
        seat_limit=seat_limit,
        registration_fee=registration_fee,
        description=description,
        banner_url=banner_url,
        status=EventStatus.DRAFT,
        is_active=True
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return {"message": "Event created successfully as Draft", "event_id": new_event.id}

# ৩. ইভেন্ট স্ট্যাটাস টগল করা (Draft <-> Published)
@router.patch("/events/{event_id}/status")
def toggle_event_status(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event.status = EventStatus.PUBLISHED if event.status == EventStatus.DRAFT else EventStatus.DRAFT
    db.commit()
    return {"message": f"Event status updated to {event.status}", "status": event.status}

# ৪. ইভেন্ট ডিলিট করা (Soft Delete)
@router.delete("/events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event.is_active = False
    db.commit()
    return {"message": "Event deleted successfully"}

# ৫. নির্দিষ্ট ক্লাবের ইভেন্টগুলোর রেজিস্ট্রেশন ও পেমেন্ট লিস্ট দেখা
@router.get("/registrations/{club_id}")
def get_club_registrations(club_id: int, db: Session = Depends(get_db)):
    registrations = db.query(EventRegistration).join(Event).filter(Event.club_id == club_id).all()
    
    result = []
    for reg in registrations:
        student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == reg.user_id).first()
        result.append({
            "id": reg.id,
            "student": reg.user.name,
            "email": reg.user.email,
            "studentId": student_profile.student_id if student_profile else "N/A",
            "event": reg.event.event_title,
            "ticket": reg.ticket_number or f"PL-{100 + reg.id}",
            "amount": float(reg.paid_amount or reg.event.registration_fee),
            "payment": reg.payment_status.value if hasattr(reg.payment_status, 'value') else reg.payment_status,
            "paymentMethod": reg.payment_method or "Online",
            "transactionId": reg.transaction_id or f"TRX{98765 + reg.id}"
        })
    return result

# ৬. পার্টিসিপেন্ট ম্যানেজমেন্ট ও অ্যাটেনডেন্স লিস্ট
@router.get("/participants/{club_id}")
def get_club_participants(club_id: int, db: Session = Depends(get_db)):
    registrations = db.query(EventRegistration).join(Event).filter(Event.club_id == club_id).all()
    
    result = []
    for reg in registrations:
        student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == reg.user_id).first()
        result.append({
            "id": reg.id,
            "student": reg.user.name,
            "studentId": student_profile.student_id if student_profile else "N/A",
            "event": reg.event.event_title,
            "ticket": reg.ticket_number or f"PL-{100 + reg.id}",
            "payment": reg.payment_status.value if hasattr(reg.payment_status, 'value') else reg.payment_status,
            "attendance": reg.attendance_status.value if hasattr(reg.attendance_status, 'value') else reg.attendance_status
        })
    return result

# ৭. উপস্থিতি বা চেক-ইন স্ট্যাটাস টগল করা (Check In / Undo)
@router.patch("/attendance/{registration_id}")
def toggle_attendance(registration_id: int, db: Session = Depends(get_db)):
    reg = db.query(EventRegistration).filter(EventRegistration.id == registration_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    reg.attendance_status = (
        AttendanceStatus.NOT_CHECKED_IN 
        if reg.attendance_status == AttendanceStatus.CHECKED_IN 
        else AttendanceStatus.CHECKED_IN
    )
    db.commit()
    return {"message": "Attendance updated", "attendance": reg.attendance_status}

# ৮. স্মার্ট টিকিট চেক-ইন (Ticket ID বা Student ID দিয়ে ভেরিফাই করা)
@router.post("/check-in")
def smart_check_in(ticket_or_student_id: str = Form(...), db: Session = Depends(get_db)):
    # প্রথমে টিকেট নম্বর দিয়ে খোঁজা
    reg = db.query(EventRegistration).filter(EventRegistration.ticket_number == ticket_or_student_id).first()
    
    # না পেলে স্টুডেন্ট আইডি দিয়ে খোঁজা
    if not reg:
        student_profile = db.query(StudentProfile).filter(StudentProfile.student_id == ticket_or_student_id).first()
        if student_profile:
            reg = db.query(EventRegistration).filter(EventRegistration.user_id == student_profile.user_id).first()
            
    if not reg:
        raise HTTPException(status_code=404, detail="Invalid Ticket ID or Student ID!")
    
    reg.attendance_status = AttendanceStatus.CHECKED_IN
    db.commit()
    return {"message": f"Successfully Checked In: {reg.user.name} ({reg.ticket_number or 'Ticket'})"}

# ৯. ডাইনামিক অ্যানালিটিক্স ডেটা
@router.get("/analytics/{club_id}")
def get_club_analytics(club_id: int, db: Session = Depends(get_db)):
    events = db.query(Event).filter(Event.club_id == club_id, Event.is_active == True).all()
    total_events = len(events)
    
    registrations = db.query(EventRegistration).join(Event).filter(Event.club_id == club_id).all()
    total_regs = len(registrations)
    
    total_revenue = sum([float(reg.paid_amount or reg.event.registration_fee) for reg in registrations])
    checked_in_count = sum([1 for reg in registrations if reg.attendance_status == AttendanceStatus.CHECKED_IN])
    
    check_in_rate = (checked_in_count / total_regs * 100) if total_regs > 0 else 0

    return {
        "totalEvents": total_events,
        "totalRegistrations": total_regs,
        "totalRevenue": total_revenue,
        "checkInRate": round(check_in_rate, 2)
    }