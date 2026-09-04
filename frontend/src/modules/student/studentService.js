// ব্যাকএন্ড API বেজ URL
const API_BASE_URL = "http://127.0.0.1:8000";

// --- USER PROFILE & PICTURE UPLOAD ---
export const updateProfile = async (userId, profileData, profilePicFile) => {
  try {
    const formData = new FormData();
    formData.append("name", profileData.name || "");
    formData.append("department", profileData.department || "CSE");
    formData.append("batch", profileData.batch || "");
    formData.append("bio", profileData.bio || "");
    formData.append("linkedin", profileData.linkedin || "");
    
    if (profilePicFile) {
      formData.append("profile_pic", profilePicFile);
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const err = await response.json();
      return { success: false, message: err.detail || "Profile update failed" };
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Server connection error" };
  }
};


// --- ACADEMIC RESOURCES & NOTES SERVICES ---

export const getAcademicResources = async (department = '', courseCode = '') => {
  try {
    let url = `${API_BASE_URL}/student/notes`;
    const params = new URLSearchParams();
    if (department) params.append("department", department);
    if (courseCode) params.append("course_code", courseCode);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        title: item.title,
        course: item.course_code,
        department: item.department,
        noteType: item.note_type,
        status: item.status || 'active',
        rating: item.rating || 0.00,
        totalRatings: item.total_ratings || 0,
        uploadedBy: item.user_id ? `User #${item.user_id}` : 'Unknown',
        downloads: item.downloads || 0,
        fileName: item.file_path ? item.file_path.split('/').pop() : 'Document.pdf',
        description: item.description
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching academic resources:", error);
    return [];
  }
};

export const uploadResource = async (newRes, userId) => {
  try {
    const formData = new FormData();
    formData.append("title", newRes.title);
    formData.append("department", newRes.department || "CSE");
    formData.append("course_code", newRes.course || "");
    formData.append("note_type", newRes.noteType || "NOTES");
    formData.append("description", newRes.description || "");
    formData.append("user_id", userId);
    
    if (newRes.file) {
      formData.append("file", newRes.file);
    }

    const response = await fetch(`${API_BASE_URL}/student/notes/upload`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const errData = await response.json();
      return { success: false, message: errData.detail || "Upload failed" };
    }
  } catch (error) {
    console.error("Error uploading resource:", error);
    return { success: false, message: "Server connection error" };
  }
};

export const deleteResource = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/notes/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting resource:", error);
    return false;
  }
};

export const rateResource = async (noteId, userId, rating) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/notes/${noteId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, rating: rating })
    });
    return response.ok;
  } catch (error) {
    console.error("Error rating resource:", error);
    return false;
  }
};


// --- MENTORSHIP SERVICES ---

export const getMentors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/mentors`);
    if (response.ok) {
      const data = await response.json();
      return data.map(mentor => ({
        id: mentor.id,
        name: mentor.name,
        role: mentor.role_title || mentor.role,
        company: mentor.company,
        rating: mentor.rating || 5.0,
        bio: mentor.bio,
        slots: mentor.slots || []
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return [];
  }
};

export const bookMentorshipSlot = async (mentorId, userId, slot) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/mentors/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mentor_id: mentorId,
        user_id: userId,
        slot_time: slot
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const errData = await response.json();
      return { success: false, message: errData.detail || "Booking failed" };
    }
  } catch (error) {
    console.error("Error booking slot:", error);
    return { success: false, message: "Server connection error" };
  }
};


// --- EVENTS SERVICES ---

export const getEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/events/upcoming`);
    if (response.ok) {
      const data = await response.json();
      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.event_date,
        location: event.location,
        seatLimit: event.seat_limit || 50,
        fee: event.registration_fee || 0
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
};

export const processEventPayment = async (eventId, userId, registrationType = "FREE", paymentDetails = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/events/register?user_id=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_id: eventId,
        registration_type: registrationType,
        transaction_id: paymentDetails.transactionId || null,
        payment_method: paymentDetails.paymentMethod || null
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const errData = await response.json();
      return { success: false, message: errData.detail || "Event registration failed" };
    }
  } catch (error) {
    console.error("Error registering event:", error);
    return { success: false, message: "Server connection error" };
  }
};


// --- CAREER JOBS SERVICES ---

export const getCareerJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/student/jobs`);
    if (response.ok) {
      const data = await response.json();
      return data.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        location: job.location,
        type: job.job_type,
        deadline: job.deadline || 'N/A',
        description: job.description
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export const applyForJob = async (jobId, userId, coverLetter, resumeFile) => {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("cover_letter", coverLetter || "");
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    const response = await fetch(`${API_BASE_URL}/student/jobs/${jobId}/apply`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      return { success: true, data: result };
    } else {
      const errData = await response.json();
      return { success: false, message: errData.detail || "Job application failed" };
    }
  } catch (error) {
    console.error("Error applying for job:", error);
    return { success: false, message: "Server connection error" };
  }
};