import { useState, useEffect } from "react";
import { socket } from "../../socket";
import API_URL from "../../api";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setUser,
  updateUser,
  logoutUser,
} from "../../redux/userprofile/userprofileSlice";
function Dashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [employeeData, setEmployeeData] = useState({
    assignedAssets: 0,
    pendingRequests: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
    trainingHours: 0,
  });

  const [myAssets, setMyAssets] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${API_URL}/employee/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          navigate("/login", { replace: true });
        }
        const data = await res.json();
        setEmployeeData({
          assignedAssets: data.assignedAssets || 0,
          pendingRequests: data.pendingRequests || 0,
          completedTasks: data.completedTasks || 0,
          upcomingDeadlines: data.upcomingDeadlines || 0,
          trainingHours: data.trainingHours || 0,
        });
        setMyAssets(data.assets || []);
        setUpcomingTasks(data.tasks || []);
        setRecentActivity(data.activity || []);
        setEmployee(data.user);
        if (data.user) {
          dispatch(
            setUser({
              userName: data.user.name,
              userId: data.user.id,
            }),
          );
        }
        // dispatch(setUser({userName : data.user.name, userId : data.user.id}));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();

    // Listen for real-time updates
    socket.on("asset-assigned-notification", (data) => {
      console.log("Asset assigned:", data);
      fetchDashboardData();
    });

    socket.on("request-status-update", (data) => {
      console.log("Request status updated:", data);
      fetchDashboardData();
    });

    return () => {
      socket.off("asset-assigned-notification");
      socket.off("request-status-update");
    };
  }, [token]);

  return (
    <>
      {/* Summary Cards */}
      <section className="summary-section">
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon assets">💻</div>
            <div className="card-content">
              <h3>My Assets</h3>
              <p className="card-number">{employeeData.assignedAssets}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon requests">📋</div>
            <div className="card-content">
              <h3>Pending Requests</h3>
              <p className="card-number">{employeeData.pendingRequests}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon tasks">✅</div>
            <div className="card-content">
              <h3>Completed Tasks</h3>
              <p className="card-number">{employeeData.completedTasks}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon notifications">⏰</div>
            <div className="card-content">
              <h3>Upcoming Deadlines</h3>
              <p className="card-number">{employeeData.upcomingDeadlines}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="card-icon notifications">📚</div>
            <div className="card-content">
              <h3>Training Hours</h3>
              <p className="card-number">{employeeData.trainingHours}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn primary">
            <span className="btn-icon">📋</span>
            Request Asset
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">🔄</span>
            Return Asset
          </button>
          <button className="action-btn tertiary">
            <span className="btn-icon">❓</span>
            Get Help
          </button>
        </div>
      </section>

      <div className="dashboard-grid">
        {/* My Assets */}
        <section className="assets-section">
          <h2>My Assets</h2>
          <div className="assets-list">
            {myAssets.length === 0 ? (
              <p className="empty-state">No assets assigned</p>
            ) : (
              myAssets.slice(0, 3).map((asset) => (
                <div key={asset.id} className="asset-item">
                  <div className="asset-info">
                    <div className="asset-name">{asset.name}</div>
                    <div className="asset-type">{asset.type}</div>
                  </div>
                  <div className="asset-details">
                    <span className={`status ${asset.status.toLowerCase()}`}>
                      {asset.status}
                    </span>
                    <span className="asset-date">{asset.assignedDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Upcoming Tasks */}
        <section className="tasks-section">
          <h2>Upcoming Tasks</h2>
          <div className="tasks-list">
            {upcomingTasks.length === 0 ? (
              <p className="empty-state">No upcoming tasks</p>
            ) : (
              upcomingTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <div className="task-name">{task.task}</div>
                    <div className="task-deadline">Due: {task.deadline}</div>
                  </div>
                  <div className="task-details">
                    <span className={`priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{task.progress}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Recent Activity */}
      {/* <section className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.length === 0 ? (
            <p className="empty-state">No recent activity</p>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-content">
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-details">{activity.details}</span>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))
          )}
        </div>
      </section> */}
    </>
  );
}

export default Dashboard;
