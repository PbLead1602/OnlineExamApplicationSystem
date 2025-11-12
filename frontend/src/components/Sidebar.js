import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Users,
  BookOpen,
  ClipboardList,
  BarChart,
  Award,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ role, onLogout, isOpen, toggleSidebar }) => {
  if (!role) return null;

  // Define menus dynamically per role
  const menus =
    role === "admin"
      ? [
          { path: "/admin-dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
          { path: "/admin-profile", label: "Profile", icon: <User size={18} /> },
          { path: "/admin-settings", label: "Settings", icon: <Settings size={18} /> },
          { path: "/manage-users", label: "Manage Users", icon: <Users size={18} /> },
          { path: "/admin-subjects", label: "Subjects", icon: <BookOpen size={18} /> },
          { path: "/admin-exams", label: "Exams", icon: <ClipboardList size={18} /> },
          { path: "/admin-questions", label: "Questions", icon: <ClipboardList size={18} /> },
          { path: "/admin-reports", label: "Reports", icon: <BarChart size={18} /> },
        ]
      : [
          { path: "/student-dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
          { path: "/student-profile", label: "Profile", icon: <User size={18} /> },
          { path: "/student-settings", label: "Settings", icon: <Settings size={18} /> },
          { path: "/assigned-exams", label: "Assigned Exams", icon: <BookOpen size={18} /> },
          { path: "/results", label: "Results", icon: <Award size={18} /> },
        ];

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <span>{role === "admin" ? "Admin Panel" : "Student Panel"}</span>
        <button className="close-btn d-lg-none" onClick={toggleSidebar}>
          ✖
        </button>
      </div>

      <ul className="sidebar-menu">
        {menus.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span className="label">{item.label}</span>
            </NavLink>
          </li>
        ))}

        <li>
          <button className="sidebar-link logout-btn" onClick={onLogout}>
            <LogOut size={18} />
            <span className="label">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
