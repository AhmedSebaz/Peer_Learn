// ব্যাকএন্ড API বেজ URL
const API_BASE_URL = "http://127.0.0.1:8000";

// ১. এডমিন ড্যাশবোর্ডের ওভারভিউ স্ট্যাটাস (ডাইনামিক ভ্যালু ফেচ করার জন্য)
export const fetchAdminDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
    if (response.ok) {
      return await response.json();
    }
    // ফলব্যাক বা ডিফল্ট শূন্য মান যদি সার্ভার রেসপন্স না করে
    return {
      totalUsers: 0,
      studentsCount: 0,
      alumniCount: 0,
      pendingVerifications: 0,
      flaggedReports: 0,
      activeEvents: 0,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return null;
  }
};

// ২. রেজিস্ট্রেশন ভেরিফিকেশন কিউ (Pending Users)
export const fetchVerificationQueue = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/verifications/pending`);
    if (response.ok) {
      const data = await response.json();
      return data.map(user => {
        // ক্লাব লিড বা অন্যান্য রোলের ডকুমেন্ট পাথ হ্যান্ডেল করার জন্য সেফটি চেক
        let cleanPath = user.document_path || user.approval_document || user.student_id_card || user.alumni_id_card || '';
        
        if (cleanPath.startsWith('/')) {
          cleanPath = cleanPath.slice(1);
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'Student',
          department: user.department || 'CSE',
          studentId: user.student_id || user.id,
          submittedDate: user.submitted_date || 'Recent',
          documentUrl: cleanPath ? (cleanPath.startsWith('http') ? cleanPath : `${API_BASE_URL}/${cleanPath}`) : ''
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching verification queue:", error);
    return [];
  }
};

// ইউজারের ভেরিফিকেশন অ্যাকশন (Accept / Reject)
export const handleVerificationAction = async (userId, action) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/verifications/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: action }) // action: 'accept' বা 'reject'
    });
    return response.ok;
  } catch (error) {
    console.error("Error processing verification action:", error);
    return false;
  }
};

// ৩. কনটেন্ট মডারেশন (Notes & Questions - Pending, Approved, Rejected সহ সব দেখার জন্য)
export const fetchFlaggedContent = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/notes/moderation`);
    if (response.ok) {
      const data = await response.json();
      return data.map(item => {
        let cleanPath = item.file_path || '';
        if (cleanPath.startsWith('/')) {
          cleanPath = cleanPath.slice(1);
        }
        return {
          id: item.id,
          title: item.title,
          type: item.note_type || 'Academic Note',
          status: item.status || 'pending', // 'pending', 'active', 'rejected'
          uploadedBy: item.uploader_name || `User #${item.user_id}`,
          reason: item.reason || 'Pending Review',
          date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent',
          fileUrl: cleanPath ? (cleanPath.startsWith('http') ? cleanPath : `${API_BASE_URL}/${cleanPath}`) : ''
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching content moderation list:", error);
    return [];
  }
};

// নোটস/কোশ্চেন মডারেশন অ্যাকশন (Approve / Reject / Pending)
export const updateNoteStatus = async (noteId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/notes/${noteId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status }) // status: 'active' (approve), 'rejected', 'pending'
    });
    return response.ok;
  } catch (error) {
    console.error("Error updating note status:", error);
    return false;
  }
};

// ৪. ইউজার লিস্ট এবং ব্যান/আনব্যান ম্যানেজমেন্ট
export const fetchUsersList = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`);
    if (response.ok) {
      const data = await response.json();
      return data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status || 'Active', // 'Active', 'Suspended' (Banned)
        dept: user.department || 'CSE'
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching users list:", error);
    return [];
  }
};

// ইউজার ব্যান বা আনব্যান করার ফাংশন
export const toggleUserBanStatus = async (userId, newStatus) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }) // 'Active' বা 'Suspended'
    });
    return response.ok;
  } catch (error) {
    console.error("Error toggling user ban status:", error);
    return false;
  }
};

// ৫. এলামনাই জব পোস্ট মডারেশন (Pending/Approved/Rejected Jobs)
export const fetchPendingJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/jobs/moderation`);
    if (response.ok) {
      const data = await response.json();
      return data.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        postedBy: job.posted_by || 'Alumni',
        location: job.location,
        type: job.job_type,
        status: job.status || 'pending', // 'pending', 'active', 'rejected'
        date: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recent',
        description: job.description
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching jobs moderation list:", error);
    return [];
  }
};

// জব পোস্ট মডারেশন অ্যাকশন (Approve / Reject / Pending)
export const updateJobStatus = async (jobId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/jobs/${jobId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status }) // 'active', 'rejected', 'pending'
    });
    return response.ok;
  } catch (error) {
    console.error("Error updating job status:", error);
    return false;
  }
};