import { useState } from "react";
import "./AdminDashboard.css";
import Dashboard from "./Dashboard";
import Assets from "./Assets";
import Assign from "./Assign";
import Users from "./Users";
import Maintenance from "./Maintenance";
import Reports from "./Reports";
import Settings from "./Settings";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActiveSection } from "../../redux/sidebar/sidebarSlice";

function AdminDashboard({ currentUser }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeSection = useSelector((state) => state.activeSection.value);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "" },
    { id: "assets", label: "Assets", icon: "" },
    { id: "users", label: "Users / Employees", icon: "" },
    { id: "assign", label: "Assign Assets", icon: "" },
    { id: "maintenance", label: "Maintenance", icon: "" },
    { id: "reports", label: "Reports", icon: "" },
    { id: "settings", label: "Settings", icon: "" },
  ];

  function onLogout() {
    localStorage.clear();
    navigate("/login", { replace: true });
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1 className="app-title">Asset Management</h1>
        </div>
        <div className="header-right">
          <div className="admin-profile">
            <span className="admin-name">{currentUser}</span>
            <div className="profile-icon">👤</div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
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
                onClick={() => dispatch(setActiveSection(item.id))}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {activeSection === "dashboard" && <Dashboard></Dashboard>}

          {activeSection !== "dashboard" && (
            <>
              {/* Assets Section */}
              {activeSection === "assets" && <Assets></Assets>}

              {/* Users Section */}
              {activeSection === "users" && <Users></Users>}

              {/* Assign Assets Section */}
              {activeSection === "assign" && <Assign></Assign>}

              {/* Maintenance Section */}
              {activeSection === "maintenance" && <Maintenance></Maintenance>}

              {/* Reports Section */}
              {activeSection === "reports" && <Reports></Reports>}

              {/* Settings Section */}
              {activeSection === "settings" && <Settings></Settings>}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
