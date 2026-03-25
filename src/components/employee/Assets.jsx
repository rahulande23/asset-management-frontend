import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import API_URL from "../../api";

function Assets() {
  const userId = useSelector((state) => state.user.userId);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch(
          `${API_URL}/employee/assets/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setAssets(data.assets || []);
          console.log(data.assets);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [token]);

  // const filteredAssets = assets.filter((asset) => {
  //   const matchesSearch =
  //     asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesType = filterType === "all" || asset.type === filterType;
  //   return matchesSearch && matchesType;
  // });

  const handleReturnClick = (asset) => {
    setSelectedAsset(asset);
    setShowReturnModal(true);
  };

  const handleConfirmReturn = async () => {
    if (!selectedAsset) return;

    try {
      const res = await fetch(
        `${API_URL}/employee/assets/${selectedAsset.id}/return`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: userId,
            reason: "Asset return requested by employee",
          }),
        },
      );

      if (res.ok) {
        alert("Return request submitted successfully!");
        // Refresh assets list
        const refreshRes = await fetch(
          `${API_URL}/employee/assets/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setAssets(data.assets || []);
        }
      } else {
        alert("Failed to submit return request");
      }
    } catch (error) {
      console.error("Error returning asset:", error);
      alert("Error submitting return request");
    } finally {
      setShowReturnModal(false);
      setSelectedAsset(null);
    }
  };

  const handleCancelReturn = () => {
    setShowReturnModal(false);
    setSelectedAsset(null);
  };

  if (loading) {
    return <div className="loading">Loading assets...</div>;
  }

  return (
    <>
      <section className="section-header">
        <h2>My Assets</h2>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
            <option value="Monitor">Monitor</option>
            <option value="Mobile">Mobile Device</option>
            <option value="Accessory">Accessory</option>
          </select>
        </div>
      </section>

      {/* Assets Table */}
      <section className="data-table">
        <div className="table-header">
          <div className="table-cell">Asset Name</div>
          <div className="table-cell">Type</div>
          {/* <div className="table-cell">Serial Number</div> */}
          <div className="table-cell">Status</div>
          <div className="table-cell">Purchased Date</div>
          <div className="table-cell">Actions</div>
        </div>
        {assets.length === 0 ? (
          <div className="empty-state">No assets found</div>
        ) : (
          assets.map((asset) => (
            <div key={asset.id} className="table-row">
              <div className="table-cell font-medium">{asset.asset_code}</div>
              <div className="table-cell">{asset.category}</div>
              {/* <div className="table-cell">{asset.serialNumber}</div> */}
              <div className="table-cell">
                <span className={`status-badge ${asset.status.toLowerCase()}`}>
                  {asset.status}
                </span>
              </div>
              <div className="table-cell">{asset.purchased_date}</div>
              <div className="table-cell">
                <button
                  className="return-asset-btn"
                  onClick={() => handleReturnClick(asset)}
                >
                  Return
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Return Confirmation Modal */}
      {showReturnModal && (
        <div className="modal-overlay" onClick={handleCancelReturn}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Return Asset</h3>
              <button className="modal-close-btn" onClick={handleCancelReturn}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-message">Do you want to return this asset?</p>
              {selectedAsset && (
                <div className="asset-details-box">
                  <p>
                    <strong>Asset:</strong> {selectedAsset.asset_code}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedAsset.category}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedAsset.status}
                  </p>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="action-btn primary"
                onClick={handleConfirmReturn}
              >
                Yes, Return Asset
              </button>
              <button
                className="action-btn secondary"
                onClick={handleCancelReturn}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Assets;
