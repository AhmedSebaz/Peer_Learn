// ডামি ইউজার ডেটাসেট
export const MOCK_USERS = [
  { email: "student@bup.edu.bd", password: "123", role: "student", name: "Istiack Ahmed" },
  { email: "admin@bup.edu.bd", password: "123", role: "admin", name: "System Admin" },
  { email: "alumni@bup.edu.bd", password: "123", role: "alumni", name: "Tanvir Hossain" },
  { email: "club@bup.edu.bd", password: "123", role: "club_lead", name: "CPC President" }
];

// লগইন ভ্যালিডেশন ফাংশন
export const authenticateUser = (email, password, role) => {
  const matchedUser = MOCK_USERS.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && 
              user.password === password && 
              user.role === role
  );
  return matchedUser || null;
};