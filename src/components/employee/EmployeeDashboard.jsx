import { useState } from "react";
import "./EmployeeDashboard.css";
import Dashboard from "./Dashboard";
import Assets from "./Assets";
import EmployeeRequest from "./EmployeeRequest";
import Tasks from "./Tasks";
import Profile from "./Profile";
import Help from "./Help";

const EmployeeDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const currentUser = localStorage.getItem("userEmail") || "Employee";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "assets", label: "My Assets", icon: "💻" },
    { id: "requests", label: "My Requests", icon: "📋" },
    { id: "tasks", label: "Tasks", icon: "✅" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "help", label: "Help & Support", icon: "❓" },
  ];

  return (
    <div className="employee-dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1 className="app-title">Employee Portal</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <span className="user-name">{currentUser}</span>
            <div className="profile-icon">👤</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="nav">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${
                  activeSection === item.id ? "active" : ""
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection === "assets" && <Assets />}
          {activeSection === "requests" && <EmployeeRequest />}
          {activeSection === "tasks" && <Tasks />}
          {activeSection === "profile" && <Profile />}
          {activeSection === "help" && <Help />}
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
