import React, { useState, useEffect } from 'react';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx'; // রেজিস্টার পেজ ইমপোর্ট করা হলো
import StudentDashboard from './modules/student/StudentDashboard.jsx';
import AdminDashboard from './modules/admin/AdminDashboard.jsx';
import AlumniDashboard from './modules/alumni/AlumniDashboard.jsx';
import ClubLeadDashboard from './modules/club_lead/ClubLeadDashboard.jsx';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // নতুন স্টেট: ইউজার কি সাইন-আপ পেজে যেতে চায় কিনা তা ট্র্যাক করার জন্য
  const [isRegistering, setIsRegistering] = useState(false);

  // পেজ লোড বা রিফ্রেশ করার সময় localStorage থেকে ইউজারের তথ্য চেক করা
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('campusconnect_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem('campusconnect_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // সফল লগইন বা রেজিস্ট্রেশন হলে স্টেট এবং লোকালস্টোরেজে ইউজার সেভ করা
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('campusconnect_user', JSON.stringify(user));
    setIsRegistering(false);
  };

  // লগআউট হ্যান্ডলার
  const handleLogout = () => {
    localStorage.removeItem('campusconnect_user');
    setCurrentUser(null);
    setIsRegistering(false);
  };

  // ডাটা লোড হওয়ার সময় লোডিং স্টেট দেখানো
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-500 animate-pulse">Loading CampusConnect...</div>
      </div>
    );
  }

  // ১. ইউজার যদি লগইন করা না থাকে
  if (!currentUser) {
    // যদি ইউজার রেজিস্টার করতে চায়, তবে Register পেজ দেখাও
    if (isRegistering) {
      return (
        <Register 
          onSwitchToLogin={() => setIsRegistering(false)} 
          onRegisterSuccess={handleLoginSuccess}
        />
      );
    }
    // অন্যথায় Login পেজ দেখাও এবং সাইন-আপে যাওয়ার প্রপস পাস করো
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onSwitchToRegister={() => setIsRegistering(true)} 
      />
    );
  }

  // ২. ইউজার লগইন করা থাকলে তার 'role' অনুযায়ী নির্দিষ্ট ড্যাশবোর্ড রেন্ডার করবে
  switch (currentUser.role) {
    case 'student':
      return <StudentDashboard user={currentUser} onLogout={handleLogout} />;
    
    case 'admin':
      return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
    
    case 'alumni':
      return <AlumniDashboard user={currentUser} onLogout={handleLogout} />;
    
    case 'club_lead':
      return <ClubLeadDashboard user={currentUser} onLogout={handleLogout} />;
    
    default:
      // ভুল রোল বা অনির্ধারিত রোল থাকলে ইউজারকে সেফলি লগআউট করে লগইন পেজে পাঠানো
      handleLogout();
      return <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setIsRegistering(true)} />;
  }
}

export default App;