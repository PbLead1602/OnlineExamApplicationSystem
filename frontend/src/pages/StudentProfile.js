import React from "react";

const StudentProfile = () => {
  const username = localStorage.getItem("username");

  return (
    <div>
      <h2>👤 Student Profile</h2>
      <p>Hello, {username}</p>
      <p>This is your profile page.</p>
    </div>
  );
};

export default StudentProfile;
