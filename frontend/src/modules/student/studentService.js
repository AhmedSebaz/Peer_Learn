// Mock Data Storage for Academic Resources
let mockResources = [
  {
    id: 1,
    title: 'Data Structures & Algorithms Handwritten Notes',
    course: 'CSE-2101',
    uploadedBy: 'MD Istiack',
    downloads: 142,
    fileName: 'DSA_Notes_2026.pdf'
  },
  {
    id: 2,
    title: 'Object Oriented Programming JavaFX Cheat Sheet',
    course: 'CSE-2203',
    uploadedBy: 'Aziz',
    downloads: 89,
    fileName: 'JavaFX_Guide.pdf'
  },
  {
    id: 3,
    title: 'Database Management Systems SQL Query Bank',
    course: 'CSE-3101',
    uploadedBy: 'Rahat Hasan',
    downloads: 215,
    fileName: 'DBMS_SQL_Practice.pdf'
  },
  {
    id: 4,
    title: 'Operating System Short Notes & Architecture Diagram',
    course: 'CSE-3201',
    uploadedBy: 'MD Istiack',
    downloads: 64,
    fileName: 'OS_Summary.pdf'
  },
  {
    id: 5,
    title: 'Algorithm Design Analysis Mid-Term Question Solution',
    course: 'CSE-3203',
    uploadedBy: 'Sabbir Ahmed',
    downloads: 178,
    fileName: 'Algorithm_Sol_2026.pdf'
  }
];

// Mock Data Storage for Mentors
let mockMentors = [
  {
    id: 1,
    name: 'Tanvir Ahmed',
    role: 'Software Engineer',
    company: 'Google',
    rating: 4.9,
    bio: 'Ex-BUPian (Dept. of CSE). Specializes in System Design, Backend Architecture, and Codeforces Problem Solving.',
    slots: ['10:00 AM', '02:30 PM', '06:00 PM']
  },
  {
    id: 2,
    name: 'Nadia Chowdhury',
    role: 'UI/UX Designer',
    company: 'Grab',
    rating: 4.8,
    bio: 'Product Designer focusing on Design Systems, User Research, and Micro-interactions. Happy to review portfolios!',
    slots: ['11:00 AM', '04:00 PM']
  },
  {
    id: 3,
    name: 'Arafat Rahman',
    role: 'Data Scientist',
    company: 'Brain Station 23',
    rating: 4.9,
    bio: 'Passionate about Machine Learning, NLP, and Data Pipelines. Guidance on ML thesis and career roadmap.',
    slots: ['03:00 PM', '07:30 PM', '09:00 PM']
  },
  {
    id: 4,
    name: 'Sabrina Islam',
    role: 'Full Stack Developer',
    company: 'Therap BD',
    rating: 4.7,
    bio: 'Working with React, Node.js, and Cloud Infrastructure. Can guide on Web Projects and Technical Interview Prep.',
    slots: ['05:00 PM', '08:00 PM']
  }
];

// --- ACADEMIC RESOURCES SERVICES ---
export const getAcademicResources = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockResources]), 300);
  });
};

export const uploadResource = async (newRes) => {
  return new Promise((resolve) => {
    const resource = {
      id: Date.now(),
      title: newRes.title,
      course: newRes.course,
      uploadedBy: 'MD Istiack',
      downloads: 0,
      fileName: newRes.fileName || 'Document.pdf'
    };
    mockResources.unshift(resource);
    setTimeout(() => resolve(resource), 300);
  });
};

export const deleteResource = async (id) => {
  return new Promise((resolve) => {
    mockResources = mockResources.filter((res) => res.id !== id);
    setTimeout(() => resolve(true), 300);
  });
};

// --- MENTORSHIP SERVICES ---
export const getMentors = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockMentors]), 300);
  });
};

export const bookMentorshipSlot = async (mentorId, slot) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, mentorId, slot }), 300);
  });
};

// Mock Events Data
let mockEvents = [
  {
    id: 1,
    title: 'Inter-University Hackathon 2026',
    description: '36-hour coding battle focused on AI and Smart Campus solutions. Food and swags provided!',
    date: '15 Sep 2026',
    location: 'BUP Auditorium',
    fee: 0
  },
  {
    id: 2,
    title: 'System Design & Microservices Workshop',
    description: 'Hands-on training session on scaling web apps, Docker, and Kubernetes by industry leads.',
    date: '28 Sep 2026',
    location: 'Lab-402, Dept. of CSE',
    fee: 10
  },
  {
    id: 3,
    title: 'IEEE Tech Seminar: Quantum Computing Basics',
    description: 'An introductory session on quantum algorithms and future possibilities in computing.',
    date: '05 Oct 2026',
    location: 'Central Multipurpose Hall',
    fee: 0
  }
];

// Events Services
export const getEvents = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockEvents]), 300);
  });
};

export const processEventPayment = async (eventId, fee) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, eventId, fee }), 300);
  });
};
// Mock Career Jobs Data
let mockJobs = [
  {
    id: 1,
    title: 'Software Engineer Intern (React / Node)',
    company: 'Brain Station 23',
    location: 'Dhaka, Bangladesh (Hybrid)',
    type: 'Internship',
    deadline: '10 Sep 2026',
    description: 'Looking for 3rd/4th year CSE undergrads with strong fundamentals in JavaScript, React, and REST APIs.'
  },
  {
    id: 2,
    title: 'Junior QA Automation Engineer',
    company: 'Therap BD',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
    deadline: '20 Sep 2026',
    description: 'Fresh graduates welcome! Basic understanding of Selenium, Java/Python, and SQL required.'
  },
  {
    id: 3,
    title: 'UI/UX Design Trainee',
    company: 'Pathao',
    location: 'Remote',
    type: 'Part-time',
    deadline: '05 Oct 2026',
    description: 'Work alongside lead designers to create wireframes and UI components in Figma.'
  }
];

export const getCareerJobs = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockJobs]), 300);
  });
};