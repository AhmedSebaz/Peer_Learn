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
  // যদি রোল স্টুডেন্ট হয়, তবে ব্যাকএন্ডে রিকোয়েস্ট পাঠাবে
  if (role === "student") {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email : email, // FastAPI OAuth2 সাধারণত username ফিল্ডে email নেয়
          password: password,
          role: role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // ব্যাকএন্ড থেকে সফলভাবে লগইন হলে ইউজার অবজেক্ট রিটার্ন করবে
        return {
          email: email,
          role: "student",
          name: data.name || "Student",
          access_token: data.access_token,
          user_id: data.user_id
        };
      } else {
        return null; // ভুল ইমেইল বা পাসওয়ার্ড হলে
      }
    } catch (error) {
      console.error("Backend login error:", error);
      return null;
    }
  } 
  
  // অন্য রোলগুলোর (Admin, Alumni, Club Lead) জন্য আগের মতো ডামি ডাটা চেক করবে
  else {
    const matchedUser = MOCK_USERS.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && 
                user.password === password && 
                user.role === role
    );
    return matchedUser || null;
  }
};

// নতুন ইউজার রেজিস্ট্রেশনের জন্য ফাংশন (ফাইল আপলোডসহ FormData ব্যবহার করা হয়েছে)
export const registerUser = async (formDataObject) => {
  try {
    const formData = new FormData();
    
    // ফরমের ডাটাগুলো FormData অবজেক্টে অ্যাপেন্ড করা
    Object.keys(formDataObject).forEach((key) => {
      if (formDataObject[key] !== null && formDataObject[key] !== undefined) {
        formData.append(key, formDataObject[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: formData, // যেহেতু আইডি কার্ড বা ফাইল যাচ্ছে, তাই Content-Type হেডার ম্যানুয়ালি JSON দেওয়া যাবে না
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