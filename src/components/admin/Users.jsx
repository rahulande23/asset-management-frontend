import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import API_URL from "../../api";

function Users({}) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const activeSection = useSelector((state) => state.activeSection.value);
  const [selectedUser, setSelectedUser] = useState("");
  // const [userAssets, setUserAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState([]);
  const [assets, setAssets] = useState([]);
  const [curRole, setCurRole] = useState("all");
  const [curDepartment, setCurDepartment] = useState("all");
  const [curSearch, setCurSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [assetToReturn, setAssetToReturn] = useState(null);
  // const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    try {
      const intialFetch = async () => {
        const res = await fetch(`${API_URL}/admin/users`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data, "token in still active");

        if (!res.ok) {
          console.log("error occured", data.message);
          navigate("/login", { replace: true });
          return;
        }

        setUserData(data.users || []);
        setAssets(data.asset_details || []);
      };
      intialFetch();
    } catch (e) {
      alert("error : ", e);
      navigate("/login", { replace: true });
    }
  }, [activeSection, navigate, token]);

  const noOfUserAssets = (userEmail) => {
    const userAssets =
      assets.length > 0
        ? assets.filter(
            (asset) =>
              asset.email &&
              asset.email.toLowerCase() === userEmail.toLowerCase(),
          )
        : [];
    return userAssets;
  };

  // const handleUserSearch = (query) => {
  //   setSearchQuery(query);
  //   if (query.trim() === "") {
  //     setSelectedUser("");
  //     setUserAssets([]);
  //     return;
  //   }

  //   // Find user by ID (case insensitive)
  //   const userId = query.toUpperCase();
  //   const foundUserData = userData[userId];

  //   if (foundUserData) {
  //     setSelectedUser(userId);
  //     setUserAssets(foundUserData.assets);
  //   } else {
  //     setSelectedUser("");
  //     setUserAssets([]);
  //   }
  // };

  const toggleRowExpansion = (userId) => {
    if (expandedRow === userId) {
      setExpandedRow(null); // Close if already open
    } else {
      setExpandedRow(userId); // Open this row and close others
    }
  };

  const handleRemoveAsset = (userId, assetId, assetName, userName) => {
    setAssetToReturn({
      userId,
      assetId,
      assetName,
      userName,
    });
    setShowRemoveConfirmation(true);
  };

  const confirmRemoveAsset = async () => {
    // Here you would typically make an API call to remove the asset
    try {
      console.log("sending return request from client side");
      // API call to return the asset
      const res = await fetch(
        `${API_URL}/admin/assign/returnAsset`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: assetToReturn.userId,
            assetId: assetToReturn.assetId,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || data.message === "duplicate-request") {
        alert(data.message);
        return;
      }
      alert("Asset return request has sent to the employee successfully!");
      // Refresh the user's assets
    } catch (e) {
      console.log("Error returning asset:", e);
      // alert("Error occurred while returning the asset");
      console.log(
        "error occured while sending the asset return request from frontend",
      );
    }
    console.log(
      `Removing asset ${assetToReturn.assetId} from user ${assetToReturn.userId}`,
    );

    // setRefresh(prev => prev == 0? 1 : 0);
    setShowRemoveConfirmation(false);
    setAssetToReturn(null);
  };

  const cancelRemoveAsset = () => {
    setShowRemoveConfirmation(false);
    setAssetToReturn(null);
  };

  return (
    <>
      <div className="users-section">
        <div className="section-header">
          <h2>User Management</h2>
          <div className="section-actions">
            <button className="action-btn primary">
              <span className="btn-icon">👤</span>
              Add New User
            </button>
          </div>
        </div>

        {/* User Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            {/* <div className="stat-icon">👥</div> */}
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-number">156</p>
            </div>
          </div>
          <div className="stat-card">
            {/* <div className="stat-icon">✅</div> */}
            <div className="stat-content">
              <h3>Active Users</h3>
              <p className="stat-number">142</p>
            </div>
          </div>
          <div className="stat-card">
            {/* <div className="stat-icon">⏸️</div> */}
            <div className="stat-content">
              <h3>Inactive Users</h3>
              <p className="stat-number">14</p>
            </div>
          </div>
          <div className="stat-card">
            {/* <div className="stat-icon">🆕</div> */}
            <div className="stat-content">
              <h3>New This Month</h3>
              <p className="stat-number">8</p>
            </div>
          </div>
        </div>

        {/* User Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <select
              className="filter-select"
              onChange={(e) => setCurRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teamleader">Team Leader</option>
              <option value="employee">Employee</option>
            </select>
            <select
              className="filter-select"
              onChange={(e) => setCurDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="it">IT</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
              <option value="marketing">Marketing</option>
            </select>
            <input
              type="text"
              className="search-input"
              placeholder="Search users..."
              onChange={(e) => setCurSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="data-table">
          <div className="table-header">
            <div className="table-cell">User ID</div>
            <div className="table-cell">Name</div>
            <div className="table-cell">Email</div>
            <div className="table-cell">Role</div>
            <div className="table-cell">Assets</div>
            <div className="table-cell">Actions</div>
          </div>
          {userData
            .filter((user) =>
              curSearch == ""
                ? true
                : user.name.toLowerCase().includes(curSearch.toLowerCase()),
            )
            .filter((user) =>
              curRole == "all"
                ? true
                : user.role.toLowerCase().includes(curRole.toLowerCase()),
            )
            .filter((user) =>
              curDepartment == "all"
                ? true
                : user.department
                    .toLowerCase()
                    .includes(curDepartment.toLowerCase()),
            )
            .map((user) => (
              <div key={user.id}>
                <div className="table-row">
                  <div className="table-cell">{user.id}</div>
                  <div className="table-cell font-medium">{user.name}</div>
                  <div className="table-cell email " title={user.email}>
                    {user.email}
                  </div>
                  <div className="table-cell">
                    <span
                      className={`role-badge ${user.role.toLowerCase().replace(" ", "-")}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="table-cell">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>{noOfUserAssets(user.email).length}</span>
                      <button
                        className="dropdown-arrow-btn"
                        onClick={() => toggleRowExpansion(user.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          padding: "4px",
                          borderRadius: "4px",
                          transition: "transform 0.2s ease",
                          transform:
                            expandedRow === user.id
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                        title="View assets"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <div className="table-cell">
                    <div className="action-buttons">
                      <button className="icon-btn edit" title="Edit">
                        ✏️
                      </button>
                      <button className="icon-btn delete" title="Delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Assets dropdown */}
                {expandedRow === user.id && (
                  <div
                    className="assets-dropdown"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      borderTop: "none",
                      padding: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 12px 0",
                        color: "#495057",
                        fontSize: "14px",
                      }}
                    >
                      Assets assigned to {user.name}:
                    </h4>
                    <div className="assets-list">
                      {noOfUserAssets(user.email).map((asset) => (
                        <div
                          key={asset.id}
                          className="asset-item"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 12px",
                            backgroundColor: "white",
                            border: "1px solid #dee2e6",
                            borderRadius: "4px",
                            marginBottom: "4px",
                          }}
                        >
                          <div
                            style={{ display: "flex", gap: "16px", flex: 1 }}
                          >
                            <span
                              style={{ fontWeight: "500", minWidth: "80px" }}
                            >
                              {asset.id}
                            </span>
                            <span style={{ flex: 1 }}>{asset.name}</span>
                            <span
                              style={{ color: "#6c757d", minWidth: "80px" }}
                            >
                              {asset.category}
                            </span>
                            <span
                              style={{ color: "#6c757d", minWidth: "100px" }}
                            >
                              {asset.assignedDate || "no date"}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <span
                              className={`status-badge ${asset.status.toLowerCase()}`}
                              style={{ fontSize: "12px" }}
                            >
                              {asset.status}
                            </span>
                            {/* <button
                              className="icon-btn view"
                              title="View Asset"
                              style={{ fontSize: "12px" }}
                            >
                              👁️
                            </button> */}
                            <button
                              className="icon-btn return"
                              title="Remove Asset"
                              style={{
                                fontSize: "12px",
                                backgroundColor: "#dc3545",
                                color: "white",
                                marginLeft: "4px",
                              }}
                              onClick={() =>
                                handleRemoveAsset(
                                  user.id,
                                  asset.id,
                                  asset.name,
                                  user.name,
                                )
                              }
                            >
                              ↩️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Remove Asset Confirmation Popup */}
        {showRemoveConfirmation && assetToReturn && (
          <div className="popup-overlay">
            <div className="popup-modal">
              <div className="popup-header">
                <h3>🔄 Remove Asset</h3>
                <button className="popup-close" onClick={cancelRemoveAsset}>
                  ✕
                </button>
              </div>
              <div className="popup-content">
                <p className="confirmation-message">
                  Are you sure you want to remove this asset from the employee?
                </p>
                <div className="asset-removal-info">
                  <div className="removal-details">
                    <div className="detail-row">
                      <span className="detail-label">Employee:</span>
                      <span className="detail-value">
                        {assetToReturn.userName}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Asset:</span>
                      <span className="detail-value">
                        {assetToReturn.assetName}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Asset ID:</span>
                      <span className="detail-value">
                        {assetToReturn.assetId}
                      </span>
                    </div>
                  </div>
                </div>
                <p
                  className="warning-text"
                  style={{
                    color: "#dc3545",
                    fontSize: "14px",
                    marginTop: "16px",
                    fontStyle: "italic",
                  }}
                >
                  This action will send a return request to the employee.
                </p>
              </div>
              <div className="popup-actions">
                <button
                  className="action-btn primary"
                  onClick={confirmRemoveAsset}
                  style={{ backgroundColor: "#dc3545", borderColor: "#dc3545" }}
                >
                  Yes, Remove Asset
                </button>
                <button
                  className="action-btn secondary"
                  onClick={cancelRemoveAsset}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Users;
