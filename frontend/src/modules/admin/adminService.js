// Mock initial data for Admin Panel features

export const fetchAdminDashboardStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalUsers: 1420,
        studentsCount: 1100,
        alumniCount: 320,
        pendingVerifications: 8,
        flaggedReports: 3,
        activeEvents: 5,
      });
    }, 300);
  });
};

export const fetchVerificationQueue = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'v1',
          name: 'Tanvir Hossain',
          email: 'tanvir.cse@univ.edu',
          role: 'Student',
          department: 'CSE',
          studentId: '2021-1-60-045',
          submittedDate: 'Aug 28, 2026',
          documentUrl: '#',
        },
        {
          id: 'v2',
          name: 'Nusrat Jahan',
          email: 'nusrat.alumni@gmail.com',
          role: 'Alumni',
          department: 'EEE',
          graduationYear: '2023',
          submittedDate: 'Aug 27, 2026',
          documentUrl: '#',
        },
      ]);
    }, 300);
  });
};

export const fetchFlaggedContent = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'r1',
          title: 'CSE311 Midterm Question Paper 2024',
          type: 'Academic Note',
          uploadedBy: 'Sabbir Ahmed',
          reportedBy: 'Rahat Hasan',
          reason: 'Inaccurate / Copyright Violation',
          date: 'Aug 27, 2026',
          fileUrl: '#',
        },
        {
          id: 'r2',
          title: 'Database Systems Solutions PDF',
          type: 'Study Material',
          uploadedBy: 'Unknown User',
          reportedBy: 'MD Istiack',
          reason: 'Spam / Irrelevant Content',
          date: 'Aug 28, 2026',
          fileUrl: '#',
        },
      ]);
    }, 300);
  });
};

export const fetchUsersList = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'MD Istiack', email: 'istiack@univ.edu', role: 'Student', status: 'Active', dept: 'CSE' },
        { id: '2', name: 'Sabbir Ahmed', email: 'sabbir@univ.edu', role: 'Alumni', status: 'Active', dept: 'CSE' },
        { id: '3', name: 'Rahat Hasan', email: 'rahat@univ.edu', role: 'Club Lead', status: 'Active', dept: 'EEE' },
        { id: '4', name: 'Azizul Haque', email: 'aziz@univ.edu', role: 'Student', status: 'Suspended', dept: 'BBA' },
      ]);
    }, 300);
  });
};

export const fetchPendingJobs = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'j1',
          title: 'Software Engineer (Frontend)',
          company: 'Brain Station 23',
          postedBy: 'Sabbir Ahmed (Alumni)',
          location: 'Dhaka (Hybrid)',
          type: 'Full-time',
          date: 'Aug 26, 2026',
          description: 'Looking for a React developer with knowledge of modern state management.',
        },
        {
          id: 'j2',
          title: 'SQA Intern',
          company: 'Therap BD',
          postedBy: 'Azizul Haque (Alumni)',
          location: 'Remote',
          type: 'Internship',
          date: 'Aug 27, 2026',
          description: 'Paid internship for CSE final semester students with basic automation knowledge.',
        },
      ]);
    }, 300);
  });
};