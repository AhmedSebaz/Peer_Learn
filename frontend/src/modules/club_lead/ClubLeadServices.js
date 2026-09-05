// ClubLeadServices.js - ক্লাব লিডারের ডামি ডেটা এবং এপিআই সার্ভিস ফাংশন

export const getInitialEvents = () => [
  { id: 1, title: 'AI & Career Development Workshop', date: '2026-08-30', time: '10:00', venue: 'University Auditorium', limit: 150, fee: 200, status: 'Published', registrations: 2 },
  { id: 2, title: 'Inter University Coding Contest', date: '2026-09-05', time: '09:00', venue: 'CSE Lab Complex', limit: 100, fee: 300, status: 'Published', registrations: 2 },
  { id: 3, title: 'Career Networking Session', date: '2026-09-10', time: '14:00', venue: 'Seminar Hall', limit: 200, fee: 0, status: 'Draft', registrations: 0 },
];

export const getInitialRegistrations = () => [
  { id: 1, student: 'Rahim Ahmed', email: 'rahim@student.edu', studentId: '22101234', event: 'AI & Career Development Workshop', ticket: 'PL-101', payment: 'Pending' },
  { id: 2, student: 'Nusrat Jahan', email: 'nusrat@student.edu', studentId: '22104567', event: 'AI & Career Development Workshop', ticket: 'PL-102', payment: 'Verified' },
  { id: 3, student: 'Tanvir Hasan', email: 'tanvir@student.edu', studentId: '23101987', event: 'Inter University Coding Contest', ticket: 'PL-103', payment: 'Verified' },
  { id: 4, student: 'Sadia Islam', email: 'sadia@student.edu', studentId: '23102345', event: 'Inter University Coding Contest', ticket: 'PL-104', payment: 'Pending' },
];

export const getInitialParticipants = () => [
  { id: 1, student: 'Rahim Ahmed', studentId: '22101234', event: 'AI & Career Development Workshop', ticket: 'PL-101', payment: 'Pending', attendance: 'Not Checked In' },
  { id: 2, student: 'Nusrat Jahan', studentId: '22104567', event: 'AI & Career Development Workshop', ticket: 'PL-102', payment: 'Verified', attendance: 'Checked In' },
  { id: 3, student: 'Tanvir Hasan', studentId: '23101987', event: 'Inter University Coding Contest', ticket: 'PL-103', payment: 'Verified', attendance: 'Checked In' },
  { id: 4, student: 'Sadia Islam', studentId: '23102345', event: 'Inter University Coding Contest', ticket: 'PL-104', payment: 'Pending', attendance: 'Not Checked In' },
];