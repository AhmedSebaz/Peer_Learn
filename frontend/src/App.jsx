import React, { useState, useEffect } from "react";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import StudentDashboard from "./modules/student/StudentDashboard.jsx";
import AdminDashboard from "./modules/admin/AdminDashboard.jsx";
import AlumniDashboard from "./modules/alumni/AlumniDashboard.jsx";
import ClubLeadDashboard from "./modules/club_lead/ClubLeadDashboard.jsx";


function App() {


  const [currentUser, setCurrentUser] = useState(null);


  useEffect(()=>{

    const user =
      localStorage.getItem("campusconnect_user");


    if(user){
      setCurrentUser(JSON.parse(user));
    }


  },[]);



  const handleLogout = ()=>{

    localStorage.removeItem(
      "campusconnect_user"
    );

    setCurrentUser(null);

  };



  if(!currentUser){

    return <Login />;

  }



  return (

    <div>


      {
        currentUser.role === "admin" &&
        <AdminDashboard />
      }



      {
        currentUser.role === "student" &&
        <StudentDashboard />
      }



      {
        currentUser.role === "alumni" &&
        <AlumniDashboard />
      }



      {
        currentUser.role === "club_lead" &&
        <ClubLeadDashboard />
      }



      <button

      onClick={handleLogout}

      className="
      fixed
      top-5
      right-5
      px-5
      py-2
      rounded-lg
      border
      text-red-600
      "

      >

      Logout

      </button>


    </div>

  );


}


export default App;