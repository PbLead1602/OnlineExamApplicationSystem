import React from "react";
import "./admin.css";

const AdminSettings = () => {
  return (
    <div className="admin-page">
      <div className="container admin-container">
        <div className="admin-glass-card">
          <h2 className="admin-heading mb-4">⚙️ Admin Settings</h2>
          
          <div className="admin-list-item">
            <h6 className="text-warning">System Preferences</h6>
            <p className="text-white-50 small">Configure global system behavior and maintenance modes.</p>
          </div>

          <div className="admin-list-item">
            <h6 className="text-warning">Security Settings</h6>
            <p className="text-white-50 small">Manage password policies and session timeouts.</p>
          </div>

          <button className="admin-btn-gold mt-4">Save Configuration</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;