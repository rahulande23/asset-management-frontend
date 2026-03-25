import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api";

function Assign({}) {
  const token = localStorage.getItem("token");
  const activeSection = useSelector((state) => state.activeSection.value);
  const navigate = useNavigate();

  const [userSearch, setUserSearch] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [users, setUsers] = useState([]);
  const [userAssets, setUserAssets] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [notes, setNotes] = useState("");
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateAssetInfo, setDuplicateAssetInfo] = useState(null);
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);
  const [assetToReturn, setAssetToReturn] = useState(null);

  useEffect(() => {
    const initialFetch = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/assign`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.log("error occurred", data.message);
          navigate("/login", { replace: true });
          return;
        }

        setUsers(data.users || []);

        setAvailableAssets(data.availableAssets || []);
      } catch (e) {
        console.log("Error occurred:", e);
        navigate("/login", { replace: true });
      }
    };

    initialFetch();
  }, [activeSection, navigate, token]);

  const getUserAssets = async (userId) => {
    try {
      console.log("Fetching assets for user ID:", userId);
      const res = await fetch(
        `${API_URL}/admin/user-assets/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.log("Error fetching user assets:", data.message);
        setUserAssets([]);
        return [];
      }

      setUserAssets(data.userAssets || []);
      console.log("User assets:", data.userAssets);
      return data.userAssets || [];
    } catch (e) {
      console.log("Error occurred:", e);
      setUserAssets([]);
      return [];
    }
  };

  // Check if employee already has an asset of the same category
  const checkDuplicateAssetType = () => {
    return userAssets.find(
      (asset) =>
        asset.category.toLowerCase() == selectedAsset.category.toLowerCase(),
    );
    // const currentAssets = getCurrentAssets(userEmail);
    // return currentAssets.find((asset) => asset.category === assetCategory);
  };

  // Handle asset assignment with duplicate check
  const handleAssignAsset = () => {
    if (!selectedUser || !selectedAsset) return;

    if (checkDuplicateAssetType()) {
      setDuplicateAssetInfo({
        employeeName: selectedUser.name,
        assetCategory: selectedAsset.category,
        existingAsset: userAssets.find(
          (asset) =>
            asset.category.toLowerCase() ==
            selectedAsset.category.toLowerCase(),
        ),
        newAsset: selectedAsset,
      });
      setShowDuplicateWarning(true);
    } else {
      // Proceed with assignment
      proceedWithAssignment();
    }
  };

  // Proceed with assignment (called after confirmation or if no duplicates)
  const proceedWithAssignment = async () => {
    // Here you would typically make an API call to assign the asset
    try {
      const res = await fetch(
        `${API_URL}/admin/assign/confirmAsset`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: selectedUser.id,
            assetId: selectedAsset.id,
            notes: notes,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        navigate("/login", { replace: true });
      }
    } catch (e) {
      alert(e);
    }

    console.log(
      "Assigning asset:",
      selectedAsset,
      "to employee:",
      selectedUser,
    );
    alert(
      `Successfully assigned ${selectedAsset.category} to ${selectedUser.name}`,
    );

    // Reset form
    setSelectedUser(null);
    setSelectedAsset(null);
    setUserSearch("");
    setAssetSearch("");
    setShowDuplicateWarning(false);
    setDuplicateAssetInfo(null);
  };

  const handleReturnAsset = async (userId, assetId, assetCode) => {
    setAssetToReturn({
      userId,
      assetId,
      assetCode,
      userName: selectedUser.name,
    });
    setShowReturnConfirmation(true);
  };

  const confirmReturnAsset = async () => {
    try {
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
      getUserAssets(assetToReturn.userId);
    } catch (e) {
      console.log("Error returning asset:", e);
      alert("Error occurred while returning the asset");
    }

    // Close the confirmation popup
    setShowReturnConfirmation(false);
    setAssetToReturn(null);
  };

  const cancelReturnAsset = () => {
    setShowReturnConfirmation(false);
    setAssetToReturn(null);
  };

  // Close warning popup
  const closeDuplicateWarning = () => {
    setShowDuplicateWarning(false);
    setDuplicateAssetInfo(null);
  };

  // Filter users based on search (ID or name)
  const filteredUsers =
    users && users.length > 0
      ? users.filter(
          (emp) =>
            String(emp.id).toLowerCase().includes(userSearch.toLowerCase()) ||
            emp.name.toLowerCase().includes(userSearch.toLowerCase()),
        )
      : [];

  // Filter assets based on search (ID or name)
  const filteredAssets = availableAssets.filter(
    (asset) =>
      asset.asset_code.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.category.toLowerCase().includes(assetSearch.toLowerCase()),
  );

  const handleEmployeeSelect = (user) => {
    setSelectedUser(user);
    setUserSearch(`${user.id} - ${user.name}`);
    getUserAssets(user.id); // Use user.id instead of user.email
  };

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setAssetSearch(`${asset.asset_code} - ${asset.category}`);
  };

  return (
    <>
      <div className="assign-section">
        <div className="section-header">
          <h2>Asset Assignment</h2>
          <div className="section-actions">
            <button className="action-btn primary">
              <span className="btn-icon">📋</span>
              New Assignment
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">🔄</span>
              Bulk Assignment
            </button>
          </div>
        </div>

        {/* Assignment Form */}
        <div className="assignment-form-section">
          <div className="form-card">
            <h3>Quick Asset Assignment</h3>
            <div className="form-grid">
              {/* Employee Selection */}
              <div className="form-group">
                <label className="form-label">
                  Select Employee (ID or Name)
                </label>
                <div className="search-container">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter employee ID (e.g., USR001) or name..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                  {userSearch && !selectedUser && (
                    <div className="search-results">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="search-result-item"
                            onClick={() => handleEmployeeSelect(user)}
                          >
                            <div className="result-main">
                              <span className="result-id">{user.id}</span>
                              <span className="result-name">{user.name}</span>
                            </div>
                            <div className="result-details">
                              <span className="result-department">
                                {user.role}
                              </span>
                              <span className="result-email">{user.email}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No users found</div>
                      )}
                    </div>
                  )}
                </div>
                {selectedUser && (
                  <div className="selected-item">
                    <span className="selected-label">Selected:</span>
                    <span className="selected-info">
                      {selectedUser.id} - {selectedUser.name} (
                      {selectedUser.role})
                    </span>
                    <button
                      className="clear-selection"
                      onClick={() => {
                        setSelectedUser(null);
                        setUserSearch("");
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Current Assets Display */}
                {selectedUser && (
                  <div className="current-assets-section">
                    <h4>Current Assets Assigned to {selectedUser.name}</h4>
                    {userAssets.length > 0 ? (
                      <div className="current-assets-list">
                        {userAssets.map((asset) => (
                          <div key={asset.id} className="current-asset-item">
                            <div className="asset-info">
                              <div className="asset-main">
                                <span className="asset-id">
                                  {asset.asset_code}
                                </span>
                                <span className="asset-name">
                                  {asset.asset_code}
                                </span>
                              </div>
                              <div className="asset-details">
                                <span className="asset-category">
                                  {asset.category}
                                </span>
                                <span className="asset-assigned-date">
                                  Assigned:{" "}
                                  {asset.assigned_date
                                    ? new Date(
                                        asset.assigned_date,
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </span>
                                <span
                                  className={`asset-status ${asset.status.toLowerCase()}`}
                                >
                                  {asset.status}
                                </span>
                              </div>
                            </div>
                            <div className="asset-actions">
                              <button
                                className="icon-btn return"
                                title="Return Asset"
                                onClick={() =>
                                  handleReturnAsset(
                                    selectedUser.id,
                                    asset.id,
                                    asset.asset_code,
                                  )
                                }
                              >
                                ↩️
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-assets">
                        <p>No assets currently assigned to this employee.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Asset Selection */}
              <div className="form-group">
                <label className="form-label">Select Asset (ID or Name)</label>
                <div className="search-container">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter asset ID (e.g., AST001) or name..."
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                  />
                  {assetSearch && !selectedAsset && (
                    <div className="search-results">
                      {filteredAssets.length > 0 ? (
                        filteredAssets.map((asset) => (
                          <div
                            key={asset.id}
                            className="search-result-item"
                            onClick={() => handleAssetSelect(asset)}
                          >
                            <div className="result-main">
                              <span className="result-id">
                                {asset.asset_code}
                              </span>
                              <span className="result-name">
                                {asset.category}
                              </span>
                            </div>
                            <div className="result-details">
                              <span className="result-category">
                                {asset.category}
                              </span>
                              <span
                                className={`result-status ${asset.status.toLowerCase()}`}
                              >
                                {asset.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No assets found</div>
                      )}
                    </div>
                  )}
                </div>
                {selectedAsset && (
                  <div className="selected-item">
                    <span className="selected-label">Selected:</span>
                    <span className="selected-info">
                      {selectedAsset.asset_code} - {selectedAsset.category}
                    </span>
                    <button
                      className="clear-selection"
                      onClick={() => {
                        setSelectedAsset(null);
                        setAssetSearch("");
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Assignment Date</label>
                <input
                  type="date"
                  className="form-input"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expected Return</label>
                <input type="date" className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Assignment notes or special instructions..."
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
            <div className="form-actions">
              <button
                className="action-btn primary"
                disabled={!selectedUser || !selectedAsset}
                onClick={handleAssignAsset}
              >
                Assign Asset
              </button>
              {/* <button className="action-btn secondary">Save as Draft</button> */}
            </div>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="recent-assignments">
          <h3>Recent Assignments</h3>
          <div className="data-table">
            <div className="table-header">
              <div className="table-cell">Asset</div>
              <div className="table-cell">Employee</div>
              <div className="table-cell">Assigned Date</div>
              <div className="table-cell">Expected Return</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Actions</div>
            </div>
            {[
              {
                asset: 'MacBook Pro 16"',
                employee: "John Smith",
                assignedDate: "2024-01-15",
                expectedReturn: "2024-12-31",
                status: "Active",
              },
              {
                asset: "iPhone 14 Pro",
                employee: "Sarah Johnson",
                assignedDate: "2024-01-10",
                expectedReturn: "2024-12-31",
                status: "Active",
              },
              {
                asset: "Wireless Headphones",
                employee: "Mike Wilson",
                assignedDate: "2024-01-08",
                expectedReturn: "2024-06-30",
                status: "Returned",
              },
            ].map((assignment, index) => (
              <div key={index} className="table-row">
                <div className="table-cell font-medium">{assignment.asset}</div>
                <div className="table-cell">{assignment.employee}</div>
                <div className="table-cell">{assignment.assignedDate}</div>
                <div className="table-cell">{assignment.expectedReturn}</div>
                <div className="table-cell">
                  <span
                    className={`status-badge ${assignment.status.toLowerCase()}`}
                  >
                    {assignment.status}
                  </span>
                </div>
                <div className="table-cell">
                  <div className="action-buttons">
                    <button className="icon-btn edit" title="Edit">
                      ✏️
                    </button>
                    {/* <button className="icon-btn return" title="Return">
                        ↩️
                      </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return Asset Confirmation Popup */}
        {showReturnConfirmation && assetToReturn && (
          <div className="popup-overlay">
            <div className="popup-modal">
              <div className="popup-header">
                <h3>🔄 Return Asset</h3>
                <button className="popup-close" onClick={cancelReturnAsset}>
                  ✕
                </button>
              </div>
              <div className="popup-content">
                <p className="confirmation-message">
                  Are you sure you want to return this asset?
                </p>
                <div className="asset-return-info">
                  <div className="return-details">
                    <div className="detail-row">
                      <span className="detail-label">Employee:</span>
                      <span className="detail-value">
                        {assetToReturn.userName}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Asset Code:</span>
                      <span className="detail-value">
                        {assetToReturn.assetCode}
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
                    color: "#28a745",
                    fontSize: "14px",
                    marginTop: "16px",
                    fontStyle: "italic",
                  }}
                >
                  This will mark the asset as available for reassignment.
                </p>
              </div>
              <div className="popup-actions">
                <button
                  className="action-btn primary"
                  onClick={confirmReturnAsset}
                  style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
                >
                  Yes, Return Asset
                </button>
                <button
                  className="action-btn secondary"
                  onClick={cancelReturnAsset}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Duplicate Asset Warning Popup */}
        {showDuplicateWarning && duplicateAssetInfo && (
          <div className="popup-overlay">
            <div className="popup-modal">
              <div className="popup-header">
                <h3>⚠️ Duplicate Asset Type Warning</h3>
                <button className="popup-close" onClick={closeDuplicateWarning}>
                  ✕
                </button>
              </div>
              <div className="popup-content">
                <p className="warning-message">
                  <strong>{duplicateAssetInfo.employeeName}</strong> already has
                  a <strong>{duplicateAssetInfo.assetCategory}</strong>{" "}
                  assigned:
                </p>
                <div className="existing-asset-info">
                  <div className="asset-badge">
                    <span className="asset-id">
                      {duplicateAssetInfo.existingAsset.id}
                    </span>
                    <span className="asset-name">
                      {duplicateAssetInfo.existingAsset.name}
                    </span>
                  </div>
                  {/* <div className="asset-date">
                    Assigned: {duplicateAssetInfo.existingAsset.assignedDate}
                  </div> */}
                </div>
                <p className="new-asset-info">
                  You are trying to assign:{" "}
                  <strong>{duplicateAssetInfo.newAsset.name}</strong> (
                  {duplicateAssetInfo.newAsset.id})
                </p>
                <p className="confirmation-text">
                  Do you still want to proceed with this assignment?
                </p>
              </div>
              <div className="popup-actions">
                <button
                  className="action-btn primary"
                  onClick={proceedWithAssignment}
                >
                  Yes, Assign Anyway
                </button>
                <button
                  className="action-btn secondary"
                  onClick={closeDuplicateWarning}
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

export default Assign;
