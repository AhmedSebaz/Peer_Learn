// ব্যাকএন্ড API বেজ URL (ফাস্টএপিআই সার্ভার লোকালটে যেখানে রান হচ্ছে)
const API_BASE_URL = "http://127.0.0.1:8000";

// অন্যান্য ইউজারদের জন্য ডামি ডেটাসেট (ব্যাকআপ বা কুইক টেস্টের জন্য রেখে দেওয়া হলো)
export const MOCK_USERS = [
  { email: "admin@bup.edu.bd", password: "123", role: "admin", name: "System Admin" },
  { email: "alumni@bup.edu.bd", password: "123", role: "alumni", name: "Tanvir Hossain" },
  { email: "club@bup.edu.bd", password: "123", role: "club_lead", name: "CPC President" }
];

// লগইন ভ্যালিডেশন ফাংশন (প্রথমে ব্যাকএন্ড API চেক করবে, ব্যাকএন্ডে না পেলে বা রোল অনুযায়ী মক ডাটা চেক করবে)
export const authenticateUser = async (email, password, role) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: email,     
        password: password,
        role: role,       
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        email: data.email || email,
        role: data.role || role,
        name: data.name || "User",
        user_id: data.user_id,
        profile_pic: data.profile_pic || null,
        department: data.department || "CSE",
        batch: data.batch || "3.2",
        semester: data.semester || "3.2",
        bio: data.bio || "",
        linkedin: data.linkedin || ""
      };
    }
  } catch (error) {
    console.error("Backend login error, checking mock users:", error);
  }

  // ব্যাকএন্ডে ফেল করলে বা সার্ভার অফ থাকলে মক ডেটা থেকে চেক করবে
  const matchedUser = MOCK_USERS.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && 
              user.password === password && 
              user.role === role
  );
  
  if (matchedUser) {
    return {
      ...matchedUser,
      department: "CSE",
      batch: "3.2",
      semester: "3.2",
      bio: "Demo user profile",
      linkedin: ""
    };
  }

  return null;
};

// নতুন ইউজার রেজিস্ট্রেশনের জন্য ফাংশন
export const registerUser = async (formDataInstance) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: formDataInstance, 
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.detail || "রেজিস্ট্রেশন ব্যর্থ হয়েছে!" };
    }
  } catch (error) {
    console.error("Backend registration error:", error);
    return { success: false, message: "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।" };
  }
};