import React from "react";
import "./admin.css";

const AdminProfile = () => {
  const username = localStorage.getItem("username");

  return (
    <div className="admin-page">
      <div className="container admin-container">
        <div className="admin-glass-card">
          <h2 className="admin-heading mb-4">👤 Admin Profile</h2>
          <div className="admin-list-item p-4">
            <h5 className="text-white">Welcome, {username}</h5>
            <p className="text-white-50">This is your secure admin profile page. From here, you can view your account credentials and assigned roles.</p>
          </div>
          <button className="admin-btn-gold mt-3">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;