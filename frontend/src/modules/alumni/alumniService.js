// alumniService.js - Real API integration for Alumni Module

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Helper function to handle authenticated headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic response handler
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }
  return response.json();
};

// ==========================================
// 1. ALUMNI PROFILE APIS
// ==========================================

// Fetch authenticated alumni profile details
export const fetchAlumniProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/alumni/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Update alumni profile (current_job_title, company, linkedin_url)
export const updateAlumniProfile = async (profileData) => {
  const response = await fetch(`${API_BASE_URL}/api/alumni/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
};

// ==========================================
// 2. MENTORSHIP SLOTS APIS
// ==========================================

// Fetch slots created by the alumni
export const fetchSlots = async () => {
  const response = await fetch(`${API_BASE_URL}/api/alumni/slots`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Create a new mentorship slot (available_date, start_time, end_time)
export const createSlot = async (slotData) => {
  const response = await fetch(`${API_BASE_URL}/api/alumni/slots`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(slotData),
  });
  return handleResponse(response);
};

// ==========================================
// 3. MENTORSHIP REQUESTS APIS
// ==========================================

// Fetch mentorship requests sent by students to this alumni
export const fetchMentorshipRequests = async () => {
  const response = await fetch(`${API_BASE_URL}/api/alumni/mentorship-requests`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Respond to mentorship request ("accepted" or "rejected")
export const updateRequestStatus = async (requestId, status) => {
  const response = await fetch(`${API_BASE_URL}/api/alumni/mentorship-requests/${requestId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

// ==========================================
// 4. JOB POSTING & APPLICATIONS APIS
// ==========================================

// Submit a new job or internship post
export const submitJobPosting = async (jobData) => {
  const response = await fetch(`${API_BASE_URL}/api/alumni/jobs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData),
  });
  return handleResponse(response);
};

// Fetch job applications for a specific job post
export const fetchJobApplications = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/api/alumni/jobs/${jobId}/applications`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const applications = await handleResponse(response);

  // Resume path formatting for direct preview/download
  return applications.map((app) => ({
    ...app,
    resumeDownloadUrl: app.resume_path
      ? (app.resume_path.startsWith("http") ? app.resume_path : `${API_BASE_URL}/${app.resume_path}`)
      : "#",
  }));
};

// Update student job application status ("shortlisted" or "rejected")
export const updateApplicationStatus = async (appId, status) => {
  const response = await fetch(`${API_BASE_URL}/api/alumni/applications/${appId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

export const deleteJobPosting = async (jobId) => {
  const response = await fetch(`${API_BASE_URL}/api/alumni/jobs/${jobId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};