// ব্যাকএন্ড API বেজ URL (তোমার FastAPI সার্ভার লোকালটে যেখানে রান হচ্ছে)
const API_BASE_URL = "http://127.0.0.1:8000";

// অন্যান্য ইউজারদের জন্য ডামি ডেটাসেট
export const MOCK_USERS = [
  { email: "admin@bup.edu.bd", password: "123", role: "admin", name: "System Admin" },
  { email: "alumni@bup.edu.bd", password: "123", role: "alumni", name: "Tanvir Hossain" },
  { email: "club@bup.edu.bd", password: "123", role: "club_lead", name: "CPC President" }
];

// লগইন ভ্যালিডেশন ফাংশন (স্টুডেন্টের জন্য ব্যাকএন্ড API এবং অন্যদের জন্য ডামি ডাটা চেক করবে)
export const authenticateUser = async (email, password, role) => {
  if (role === "student") {
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
          email: email,
          role: "student",
          name: data.name || "Student",
          access_token: data.access_token,
          user_id: data.user_id,
          profile_pic: data.profile_pic || null // <-- প্রফাইল পিকচার যুক্ত করা হলো
        };
      } else {
        return null; 
      }
    } catch (error) {
      console.error("Backend login error:", error);
      return null;
    }
  } 
  
  else {
    const matchedUser = MOCK_USERS.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && 
                user.password === password && 
                user.role === role
    );
    return matchedUser || null;
  }
};

// নতুন ইউজার রেজিস্ট্রেশনের জন্য ফাংশন (সরাসরি FormData অবজেক্ট ব্যাকএন্ডে পাঠাবে)
export const registerUser = async (formDataInstance) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: formDataInstance, // সরাসরি FormData পাঠানো হলো, তাই অতিরিক্ত কোনো লুপের প্রয়োজন নেই
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