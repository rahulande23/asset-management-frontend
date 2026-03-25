import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActiveSection } from "../../redux/sidebar/sidebarSlice";
import Request from "./Request";
import API_URL from "../../api";
function Dashboard() {
  console.log("this funciton called");

  const dispatch = useDispatch();
  const activeSection = useSelector((state) => state.activeSection.value);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [summaryData, setSummaryData] = useState({
    totalAssets: "",
    assignedAssets: "",
    availableAssets: "",
    maintenanceAssets: "",
    totalEmployees: "",
  });

  try {
    useEffect(() => {
      const intialFetch = async () => {
        const res = await fetch(`${API_URL}/admin/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.log("error occured", data.message);
          navigate("/login", { replace: true });
        }

        setSummaryData({
          totalAssets:
            data.assigned.length +
            data.available.length +
            data.maintenance.length +
            data.retired.length,
          assignedAssets: data.assigned.length,
          availableAssets: data.available.length,
          maintenanceAssets: data.maintenance.length,
          totalEmployees: data.employees,
        });
      };
      intialFetch();
    }, [activeSection, navigate, token]);
  } catch (e) {
    console.log("error occured", e);
    navigate("/login", { replace: true });
  }

  const recentActivity = [
    {
      id: 1,
      action: "Asset Assigned",
      details: "MacBook Pro assigned to John Smith",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Asset Returned",
      details: "Dell Monitor returned by Sarah Johnson",
      time: "4 hours ago",
    },
    {
      id: 3,
      action: "User Added",
      details: "New employee Mike Wilson added",
      time: "1 day ago",
    },
    {
      id: 4,
      action: "Asset Updated",
      details: "HP Laptop status changed to maintenance",
      time: "1 day ago",
    },
    {
      id: 5,
      action: "Asset Assigned",
      details: "iPhone 14 assigned to Lisa Brown",
      time: "2 days ago",
    },
  ];

  const chartData = {
    statusData: [
      { label: "Assigned", value: 892, color: "#1976d2" },
      { label: "Available", value: 285, color: "#388e3c" },
      { label: "Maintenance", value: 70, color: "#f57c00" },
    ],
    categoryData: [
      { label: "Laptops", value: 450, color: "#1976d2" },
      { label: "Desktops", value: 280, color: "#7b1fa2" },
      { label: "Monitors", value: 320, color: "#388e3c" },
      { label: "Mobile", value: 197, color: "#f57c00" },
    ],
  };

  return (
    <>
      {/* Summary Cards */}
      <section className="summary-section">
        <div className="summary-cards">
          <div className="summary-card">
            {/* <div className="card-icon"></div> */}
            <div className="card-content">
              <h3>Total Assets</h3>
              <p className="card-number">
                {summaryData.totalAssets.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="summary-card">
            {/* <div className="card-icon assigned"></div> */}
            <div className="card-content">
              <h3>Assigned Assets</h3>
              <p className="card-number">
                {summaryData.assignedAssets.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="summary-card">
            {/* <div className="card-icon available"></div> */}
            <div className="card-content">
              <h3>Available Assets</h3>
              <p className="card-number">
                {summaryData.availableAssets.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="summary-card">
            {/* <div className="card-icon maintenance">🔧</div> */}
            <div className="card-content">
              <h3>Under Maintenance</h3>
              <p className="card-number">
                {summaryData.maintenanceAssets.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="summary-card">
            {/* <div className="card-icon employees">👥</div> */}
            <div className="card-content">
              <h3>Total Employees</h3>
              <p className="card-number">
                {summaryData.totalEmployees.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button
            className="action-btn primary"
            onClick={() => dispatch(setActiveSection("assets"))}
          >
            {/* <span className="btn-icon">➕</span> */}
            Add Asset
          </button>
          <button
            className="action-btn secondary"
            onClick={() => dispatch(setActiveSection("users"))}
          >
            {/* <span className="btn-icon">👤</span> */}
            Add Employee
          </button>
          <button
            className="action-btn tertiary"
            onClick={() => dispatch(setActiveSection("assign"))}
          >
            {/* <span className="btn-icon">📋</span> */}
            Assign Asset
          </button>
        </div>
      </section>

      {/* Requests and Notifications Section */}
      <section className="requests-notifications-wrapper">
        <Request />
      </section>

      <div className="dashboard-grid">
        {/* Alerts Section */}

        {/* Charts Section */}
        <section className="charts-section">
          <h2>Asset Overview</h2>
          <div className="charts">
            <div className="chart">
              <h3>Assets by Status</h3>
              <div className="chart-bars">
                {chartData.statusData.map((item) => (
                  <div key={item.label} className="chart-bar">
                    <div className="bar-label">{item.label}</div>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${
                            (item.value /
                              Math.max(
                                ...chartData.statusData.map((d) => d.value),
                              )) *
                            100
                          }%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                    <div className="bar-value">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart">
              <h3>Assets by Category</h3>
              <div className="chart-bars">
                {chartData.categoryData.map((item) => (
                  <div key={item.label} className="chart-bar">
                    <div className="bar-label">{item.label}</div>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${
                            (item.value /
                              Math.max(
                                ...chartData.categoryData.map((d) => d.value),
                              )) *
                            100
                          }%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                    <div className="bar-value">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Activity */}
      <section className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-table">
          <div className="table-header">
            <div className="table-cell">Action</div>
            <div className="table-cell">Details</div>
            <div className="table-cell">Time</div>
          </div>
          {recentActivity.map((activity) => (
            <div key={activity.id} className="table-row">
              <div className="table-cell">
                <span className="activity-action">{activity.action}</span>
              </div>
              <div className="table-cell">{activity.details}</div>
              <div className="table-cell">
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Dashboard;
