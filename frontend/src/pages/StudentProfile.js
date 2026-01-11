import React from "react";
import "./studentStyle.css"; 

const StudentProfile = () => {
  const username = localStorage.getItem("username");

  return (
    <div className="student-page">
      <div className="student-container">
        <div className="student-glass">
          <h2 className="student-heading">👤 Student Profile</h2>
          <p className="student-sub">Name: {username}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
