import { useState, useEffect } from "react";
import { socket } from "../../socket";
import API_URL from "../../api";
import { useNavigate } from "react-router-dom";

function Request() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      message: "15 assets have warranties expiring within 30 days",
    },
    { id: 2, type: "danger", message: "3 assets are overdue for return" },
    { id: 3, type: "info", message: "8 assets pending maintenance schedule" },
  ]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch initial requests and notifications
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API_URL}/admin/requests-notifications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setRequests(data.requests || []);
          setNotifications(data.notifications || []);
        } else {
          Navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on("new-request", (data) => {
      setRequests((prev) => [data, ...prev]);
      setNotifications((prev) => [
        {
          id: Date.now(),
          type: "info",
          message: `New request from ${data.employeeName}`,
          time: new Date().toISOString(),
        },
        ...prev,
      ]);
    });

    socket.on("asset-return-request", (data) => {
      setRequests((prev) => [
        {
          id: Date.now(),
          type: "return",
          employeeName: data.employeeName,
          assetName: data.assetName,
          reason: data.reason,
          status: "pending",
          time: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNotifications((prev) => [
        {
          id: Date.now(),
          type: "warning",
          message: `Asset return request from ${data.employeeName}`,
          time: new Date().toISOString(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("new-request");
      socket.off("asset-return-request");
    };
  }, [token]);

  const handleApprove = async (requestId) => {
    try {
      const res = await fetch(
        `${API_URL}/admin/requests/${requestId}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "approved" } : req,
          ),
        );
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const res = await fetch(
        `${API_URL}/admin/requests/${requestId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "rejected" } : req,
          ),
        );
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  const clearNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  return (
    <div className="requests-notifications-container">
      {/* Notifications Section */}
      <section className="notifications-section">
        <h2>Recent Notifications</h2>
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <p className="empty-state">No new notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item notification-${notification.type}`}
              >
                <span className="notification-icon">
                  {notification.type === "warning"
                    ? "⚠️"
                    : notification.type === "danger"
                      ? "🚨"
                      : "ℹ️"}
                </span>
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {new Date(notification.time).toLocaleString()}
                  </span>
                </div>
                <button
                  className="clear-notification-btn"
                  onClick={() => clearNotification(notification.id)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Requests Section */}
      <section className="requests-section">
        <h2>Pending Requests</h2>
        <div className="requests-list">
          {requests.length === 0 ? (
            <p className="empty-state">No pending requests</p>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="request-item">
                <div className="request-header">
                  <span className={`request-type request-type-${request.type}`}>
                    {request.type === "return"
                      ? "Return Request"
                      : "Asset Request"}
                  </span>
                  <span className={`request-status status-${request.status}`}>
                    {request.status}
                  </span>
                </div>
                <div className="request-body">
                  <p className="request-employee">
                    <strong>Employee:</strong> {request.employeeName}
                  </p>
                  <p className="request-asset">
                    <strong>Asset:</strong> {request.assetName}
                  </p>
                  {request.reason && (
                    <p className="request-reason">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                  )}
                  <p className="request-time">
                    {new Date(request.time).toLocaleString()}
                  </p>
                </div>
                {request.status === "pending" && (
                  <div className="request-actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(request.id)}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(request.id)}
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Request;
