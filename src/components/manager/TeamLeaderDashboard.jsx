import { useState } from "react";
import "./TeamLeaderDashboard.css";

const TeamLeaderDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const currentUser = localStorage.getItem("userEmail") || "Team Leader";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Sample data for team leader dashboard
  const teamData = {
    teamMembers: 12,
    activeProjects: 8,
    completedTasks: 156,
    pendingApprovals: 7,
    teamAssets: 45,
  };

  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      role: "Developer",
      status: "Active",
      assets: 3,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Designer",
      status: "Active",
      assets: 2,
    },
    {
      id: 3,
      name: "Mike Wilson",
      role: "QA Engineer",
      status: "On Leave",
      assets: 4,
    },
    {
      id: 4,
      name: "Lisa Brown",
      role: "Developer",
      status: "Active",
      assets: 3,
    },
    { id: 5, name: "David Chen", role: "DevOps", status: "Active", assets: 5 },
  ];

  const pendingRequests = [
    {
      id: 1,
      employee: "John Smith",
      request: "MacBook Pro Upgrade",
      type: "Asset Request",
      priority: "High",
    },
    {
      id: 2,
      employee: "Sarah Johnson",
      request: "Adobe License",
      type: "Software",
      priority: "Medium",
    },
    {
      id: 3,
      employee: "Mike Wilson",
      request: "Monitor Setup",
      type: "Hardware",
      priority: "Low",
    },
    {
      id: 4,
      employee: "Lisa Brown",
      request: "Keyboard Replacement",
      type: "Hardware",
      priority: "Medium",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Asset Approved",
      details: "MacBook assigned to John Smith",
      time: "1 hour ago",
    },
    {
      id: 2,
      action: "Request Reviewed",
      details: "Monitor request from Sarah Johnson",
      time: "3 hours ago",
    },
    {
      id: 3,
      action: "Team Meeting",
      details: "Weekly standup completed",
      time: "1 day ago",
    },
    {
      id: 4,
      action: "Asset Returned",
      details: "Old laptop returned by Mike Wilson",
      time: "2 days ago",
    },
  ];

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "team", label: "My Team", icon: "👥" },
    { id: "requests", label: "Asset Requests", icon: "📋" },
    { id: "approvals", label: "Approvals", icon: "✅" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="teamleader-dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1 className="app-title">TeamLeader Portal</h1>
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
          {activeSection === "dashboard" && (
            <>
              {/* Summary Cards */}
              <section className="summary-section">
                <div className="summary-cards">
                  <div className="summary-card">
                    <div className="card-icon team">👥</div>
                    <div className="card-content">
                      <h3>Team Members</h3>
                      <p className="card-number">{teamData.teamMembers}</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="card-icon projects">📁</div>
                    <div className="card-content">
                      <h3>Active Projects</h3>
                      <p className="card-number">{teamData.activeProjects}</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="card-icon tasks">✅</div>
                    <div className="card-content">
                      <h3>Completed Tasks</h3>
                      <p className="card-number">{teamData.completedTasks}</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="card-icon approvals">⏳</div>
                    <div className="card-content">
                      <h3>Pending Approvals</h3>
                      <p className="card-number">{teamData.pendingApprovals}</p>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="card-icon assets">💻</div>
                    <div className="card-content">
                      <h3>Team Assets</h3>
                      <p className="card-number">{teamData.teamAssets}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Actions */}
              <section className="quick-actions-section">
                <h2>Quick Actions</h2>
                <div className="quick-actions">
                  <button className="action-btn primary">
                    <span className="btn-icon">👥</span>
                    Manage Team
                  </button>
                  <button className="action-btn secondary">
                    <span className="btn-icon">📋</span>
                    Review Requests
                  </button>
                  <button className="action-btn tertiary">
                    <span className="btn-icon">✅</span>
                    Approve Assets
                  </button>
                </div>
              </section>

              <div className="dashboard-grid">
                {/* Team Overview */}
                <section className="team-section">
                  <h2>Team Overview</h2>
                  <div className="team-list">
                    {teamMembers.slice(0, 4).map((member) => (
                      <div key={member.id} className="team-member">
                        <div className="member-info">
                          <div className="member-name">{member.name}</div>
                          <div className="member-role">{member.role}</div>
                        </div>
                        <div className="member-details">
                          <span
                            className={`status ${member.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {member.status}
                          </span>
                          <span className="asset-count">
                            {member.assets} assets
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Pending Requests */}
                <section className="requests-section">
                  <h2>Pending Requests</h2>
                  <div className="requests-list">
                    {pendingRequests.slice(0, 4).map((request) => (
                      <div key={request.id} className="request-item">
                        <div className="request-info">
                          <div className="request-title">{request.request}</div>
                          <div className="request-employee">
                            {request.employee}
                          </div>
                        </div>
                        <div className="request-details">
                          <span
                            className={`priority ${request.priority.toLowerCase()}`}
                          >
                            {request.priority}
                          </span>
                          <span className="request-type">{request.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Recent Activity */}
              <section className="activity-section">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-content">
                        <span className="activity-action">
                          {activity.action}
                        </span>
                        <span className="activity-details">
                          {activity.details}
                        </span>
                      </div>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeSection !== "dashboard" && (
            <div className="placeholder-content">
              <h2>
                {
                  navigationItems.find((item) => item.id === activeSection)
                    ?.label
                }
              </h2>
              <p>
                This section is under development. Use the dashboard for team
                management overview.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeamLeaderDashboard;
