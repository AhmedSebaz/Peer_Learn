// ClubLeadServices.js - ব্যাকএন্ড এপিআই সার্ভিস কানেক্টিভিটি

const API_BASE_URL = "http://localhost:8000/club-lead";

// ১. সমস্ত ইভেন্ট ফেচ করা
export const fetchClubEvents = async (clubId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${clubId}`);
    if (!response.ok) throw new Error("Failed to fetch events");
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// ২. নতুন ইভেন্ট তৈরি করা (FormData এবং ব্যানার ইমেজসহ)
export const createClubEvent = async (eventData, clubId = 1) => {
  try {
    const formData = new FormData();
    formData.append("club_id", clubId);
    formData.append("event_title", eventData.title);
    formData.append("venue", eventData.venue);
    formData.append("event_date", eventData.date);
    formData.append("start_time", eventData.time);
    if (eventData.deadline) formData.append("deadline", eventData.deadline);
    formData.append("seat_limit", eventData.limit);
    formData.append("registration_fee", eventData.fee);
    formData.append("description", eventData.description || "");
    
    if (eventData.imageFile) {
      formData.append("banner", eventData.imageFile);
    }

    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to create event");
    return await response.json();
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// ৩. ইভেন্ট স্ট্যাটাস পরিবর্তন (Draft <-> Published)
export const updateEventStatusApi = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/status`, {
      method: 'PATCH',
    });
    return response.ok;
  } catch (error) {
    console.error("Error toggling status:", error);
    return false;
  }
};

// ৪. ইভেন্ট ডিলিট করা
export const deleteEventApi = async (eventId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
};

// ৫. রেজিস্ট্রেশন লিস্ট ফেচ করা
export const fetchRegistrations = async (clubId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/registrations/${clubId}`);
    if (!response.ok) throw new Error("Failed to fetch registrations");
    return await response.json();
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return [];
  }
};

// ৬. পার্টিসিপেন্ট ও অ্যাটেনডেন্স লিস্ট ফেচ করা
export const fetchParticipants = async (clubId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/participants/${clubId}`);
    if (!response.ok) throw new Error("Failed to fetch participants");
    return await response.json();
  } catch (error) {
    console.error("Error fetching participants:", error);
    return [];
  }
};

// ৭. উপস্থিতি বা চেক-ইন স্ট্যাটাস টগল করা
export const updateAttendanceApi = async (registrationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/${registrationId}`, {
      method: 'PATCH',
    });
    return response.ok;
  } catch (error) {
    console.error("Error updating attendance:", error);
    return false;
  }
};

// ৮. স্মার্ট চেক-ইন (টিকেট বা স্টুডেন্ট আইডি দিয়ে)
export const verifyTicketApi = async (query) => {
  try {
    const formData = new URLSearchParams();
    formData.append("ticket_or_student_id", query);

    const response = await fetch(`${API_BASE_URL}/check-in`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error("Check-in error:", error);
    return { ok: false, data: { detail: "সার্ভার কানেকশনে সমস্যা হয়েছে!" } };
  }
};

// ৯. অ্যানালিটিক্স ডেটা ফেচ করা
export const fetchAnalytics = async (clubId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/${clubId}`);
    if (!response.ok) throw new Error("Failed to fetch analytics");
    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return { totalEvents: 0, totalRegistrations: 0, totalRevenue: 0, checkInRate: 0 };
  }
};