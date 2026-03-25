import { useState, useEffect } from "react";
import { socket } from "../../socket";
import API_URL from "../../api";
import { useSelector } from "react-redux";

function EmployeeRequest() {
  const userId = useSelector((state) => state.user.userId);
  console.log(userId);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestType, setRequestType] = useState("asset");
  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "",
    reason: "",
    priority: "medium",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch employee's requests and notifications
    console.log(userId);
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API_URL}/employee/notifications/${userId}`,
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
          // console.log(data.notifications);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Listen for real-time updates via socket
    socket.on("request-status-update", (data) => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === data.requestId ? { ...req, status: data.status } : req,
        ),
      );
      setNotifications((prev) => [
        {
          id: Date.now(),
          type: data.status, // approved, rejected, pending, completed
          message: `Your request has been ${data.status}`,
          time: new Date().toISOString(),
        },
        ...prev,
      ]);
    });

    socket.on("asset-assigned-notification", (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          type: "completed",
          message: `Asset ${data.assetName} has been assigned to you`,
          time: new Date().toISOString(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("request-status-update");
      socket.off("asset-assigned-notification");
    };
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/employee/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: requestType,
          ...formData,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRequests((prev) => [data.request, ...prev]);
        setNotifications((prev) => [
          {
            id: Date.now(),
            type: "pending",
            message: "Your request has been submitted successfully",
            time: new Date().toISOString(),
          },
          ...prev,
        ]);
        alert("Request submitted successfully!");
        setShowRequestForm(false);
        setFormData({
          assetName: "",
          assetType: "",
          reason: "",
          priority: "medium",
        });
      } else {
        alert("Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Error submitting request");
    }
  };

  const clearNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleNotificationSubmit = async (notification) => {
    try {
      // Make API call to mark the return asset notification as submitted
      const res = await fetch(
        `${API_URL}/employee/notifications/${notification.id}/submit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            notificationId: notification.id,
            assetId: notification.assetId,
          }),
        },
      );

      if (res.ok) {
        alert("your return will be evaluated and marked by manager!");
        // Remove the notification after submission
        clearNotification(notification.id);
      } else {
        alert("Failed to submit notification");
      }
    } catch (error) {
      console.error("Error submitting notification:", error);
      alert("Error submitting notification");
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      const res = await fetch(
        `${API_URL}/employee/requests/${requestId}/cancel`,
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
            req.id === requestId ? { ...req, status: "cancelled" } : req,
          ),
        );
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  return (
    <>
      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button
            className="action-btn primary"
            onClick={() => {
              setRequestType("asset");
              setShowRequestForm(true);
            }}
          >
            <span className="btn-icon">📋</span>
            Request Asset
          </button>
          <button
            className="action-btn secondary"
            onClick={() => {
              setRequestType("return");
              setShowRequestForm(true);
            }}
          >
            <span className="btn-icon">🔄</span>
            Return Asset
          </button>
        </div>
      </section>

      {/* Request Form */}
      {showRequestForm && (
        <section className="form-card-section">
          <div className="form-card">
            <div className="form-header">
              <h3>
                {requestType === "asset" ? "Request New Asset" : "Return Asset"}
              </h3>
              <button
                className="close-form-btn"
                onClick={() => setShowRequestForm(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitRequest}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Asset Name</label>
                  <input
                    type="text"
                    name="assetName"
                    className="form-input"
                    value={formData.assetName}
                    onChange={handleInputChange}
                    placeholder="e.g., MacBook Pro, Dell Monitor"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Asset Type</label>
                  <select
                    name="assetType"
                    className="form-select"
                    value={formData.assetType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="laptop">Laptop</option>
                    <option value="desktop">Desktop</option>
                    <option value="monitor">Monitor</option>
                    <option value="mobile">Mobile Device</option>
                    <option value="accessory">Accessory</option>
                    <option value="software">Software</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    name="priority"
                    className="form-select"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Reason / Description</label>
                <textarea
                  name="reason"
                  className="form-textarea"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Please explain why you need this asset..."
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="submit" className="action-btn primary">
                  Submit Request
                </button>
                <button
                  type="button"
                  className="action-btn secondary"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Requests and Notifications Grid */}
      <div className="requests-notifications-container">
        {/* Notifications Section */}
        <section className="notifications-section">
          <h2>Notifications</h2>
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
                    {notification.type === "pending"
                      ? "⏳"
                      : notification.type === "approved"
                        ? "✅"
                        : notification.type === "rejected"
                          ? "❌"
                          : notification.type === "completed"
                            ? "🎉"
                            : notification.type === "return-asset"
                              ? "🔄"
                              : "ℹ️"}
                  </span>
                  <div className="notification-content">
                    <p className="notification-message">
                      {notification.message}
                      {notification.category}
                    </p>
                    <span className="notification-message">
                      {/* {new Date(notification.time).toLocaleString()} */}
                      {/* {notification.category} */}
                      {/* click ok after submitting the asset */}
                    </span>
                    {notification.type === "return-asset" && (
                      <button
                        className="notification-action-btn"
                        title="click here after submitting the asset"
                        onClick={() => handleNotificationSubmit(notification)}
                      >
                        Submitted
                      </button>
                    )}
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

        {/* My Requests Section */}
        <section className="requests-section">
          <h2>My Requests</h2>
          <div className="requests-list">
            {requests.length === 0 ? (
              <p className="empty-state">No requests found</p>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="request-item">
                  <div className="request-header">
                    <span
                      className={`request-type request-type-${request.type}`}
                    >
                      {request.type === "return"
                        ? "Return Request"
                        : "Asset Request"}
                    </span>
                    <span className={`request-status status-${request.status}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="request-body">
                    <p className="request-asset">
                      <strong>Asset:</strong> {request.assetName}
                    </p>
                    <p className="request-type-detail">
                      <strong>Type:</strong> {request.assetType}
                    </p>
                    {request.reason && (
                      <p className="request-reason">
                        <strong>Reason:</strong> {request.reason}
                      </p>
                    )}
                    {/* <p className="request-priority">
                      <strong>Priority:</strong>{" "}
                      <span className={`priority-badge ${request.priority}`}>
                        {request.priority}
                      </span>
                    </p> */}
                    <p className="request-time">
                      Submitted: {new Date(request.time).toLocaleString()}
                    </p>
                  </div>
                  {request.status === "pending" && (
                    <div className="request-actions">
                      <button
                        className="cancel-btn"
                        onClick={() => cancelRequest(request.id)}
                      >
                        ✕ Cancel Request
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default EmployeeRequest;
