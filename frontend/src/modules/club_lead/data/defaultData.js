export const defaultEvents = [
  {
    id: 1,
    title: "AI Career Workshop",
    description:
      "Workshop about AI and future career opportunities.",
    date: "2026-09-15",
    time: "10:00",
    venue: "University Auditorium",
    deadline: "2026-09-10",
    capacity: 100,
    fee: 200,
    status: "Published"
  },

  {
    id: 2,
    title: "Programming Contest",
    description:
      "Competitive programming event.",
    date: "2026-09-25",
    time: "09:00",
    venue: "Computer Lab",
    deadline: "2026-09-20",
    capacity: 80,
    fee: 100,
    status: "Draft"
  }
];



export const defaultRegistrations = [
  {
    id: 101,
    name: "Rahim Ahmed",
    studentId: "CSE22001",
    email: "rahim@gmail.com",
    eventId: 1,
    ticketId: "PL-101",
    transactionId: "TXN12345",
    amount: 200,
    payment: "Pending",
    checkedIn: false
  },

  {
    id: 102,
    name: "Nusrat Jahan",
    studentId: "CSE22002",
    email: "nusrat@gmail.com",
    eventId: 1,
    ticketId: "PL-102",
    transactionId: "TXN12346",
    amount: 200,
    payment: "Verified",
    checkedIn: false
  }
];