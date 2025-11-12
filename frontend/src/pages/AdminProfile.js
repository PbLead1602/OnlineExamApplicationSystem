import React from "react";

const AdminProfile = () => {
  const username = localStorage.getItem("username");

  return (
    <div>
      <h2>👤 Admin Profile</h2>
      <p>Welcome, {username}</p>
      <p>This is your profile page.</p>
    </div>
  );
};

export default AdminProfile;
