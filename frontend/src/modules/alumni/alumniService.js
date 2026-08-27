
// Mock service file handling API interactions for the Alumni module

export const fetchAlumniProfile = async () => {
  return {
    name: "Alex Morgan",
    title: "Senior Software Engineer",
    company: "Tech Corp",
    graduationYear: "2021",
    department: "Computer Science & Engineering",
    avatar: "A"
  };
};

export const fetchSlots = async () => {
  return [
    { id: 1, date: "2026-08-25", time: "10:00 AM - 10:30 AM", topic: "Career Guidance & Resume Review", isBooked: false },
    { id: 2, date: "2026-08-26", time: "04:00 PM - 04:30 PM", topic: "System Design Mock Interview", isBooked: true, bookedBy: "Rahim Ahmed" }
  ];
};

export const fetchMentorshipRequests = async () => {
  return [
    { id: 101, studentName: "Siddiqur Rahman", semester: "Semester 3.2", topic: "Frontend Development Roadmaps", message: "Hi! I want to learn more about transitioning into React and Tailwind.", date: "Aug 24, 2026", status: "pending" },
    { id: 102, studentName: "Anika Chowdhury", semester: "Semester 4.1", topic: "Job Referral & Portfolio Review", message: "Looking for feedback on my full-stack project portfolio.", date: "Aug 26, 2026", status: "pending" }
  ];
};

export const createSlot = async (slotData) => {
  return { id: Date.now(), ...slotData, isBooked: false };
};

export const updateRequestStatus = async (requestId, status) => {
  return { requestId, status, success: true };
};

export const submitJobPosting = async (jobData) => {
  return { id: Date.now(), ...jobData, datePosted: new Date().toLocaleDateString() };
};