import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import API_URL from "../../api";

function Assets({}) {
  // const dispatch = useDispatch();
  const activeSection = useSelector((state) => state.activeSection.value);

  const [searchCategory, setSearchCategory] = useState("all");
  const [searchStatus, setSearchStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [assetTypes, setAssetTypes] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [allAssets, setAllAssets] = useState([]);

  try {
    useEffect(() => {
      const intialFetch = async () => {
        const res = await fetch(`${API_URL}/admin/assets`, {
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

        setAssetTypes(data.assetTypes);
        setAllAssets(data.allAssets);
      };
      intialFetch();
    }, [activeSection]);
  } catch (e) {
    alert("error : ", e);
    navigate("/login", { replace: true });
  }

  // Calculate category statistics
  const getCategoryStats = () => {
    return assetTypes
      .map((cat) => {
        const categoryAssets = allAssets.filter(
          (asset) => asset.category.toLowerCase() == cat.category.toLowerCase(),
        );
        const assignedCount = categoryAssets.filter(
          (asset) => asset.status === "Assigned",
        ).length;
        const totalCount = categoryAssets.length;
        const availableCount = categoryAssets.filter(
          (asset) => asset.status === "Available",
        ).length;
        const maintenanceCount = categoryAssets.filter(
          (asset) => asset.status === "Maintenance",
        ).length;

        return {
          category: cat.category,
          assigned: assignedCount,
          total: totalCount,
          available: availableCount,
          maintenance: maintenanceCount,
          percentage:
            totalCount > 0 ? Math.round((assignedCount / totalCount) * 100) : 0,
        };
      })
      .filter((stat) => stat.total > 0); // Only show categories that have assets
  };

  const categoryStats = getCategoryStats();
  // console.log(categoryStats);

  // Get icon for each category
  const getCategoryIcon = (category) => {
    const icons = {
      Laptop: "💻",
      Monitor: "🖥️",
      Desktop: "🖨️",
      Mobile: "📱",
      Accessory: "⌨️",
    };
    return icons[category] || "📦";
  };

  return (
    <>
      <div className="assets-section">
        <div className="section-header">
          <h2>Asset Overview by Category</h2>
          <div className="section-actions">
            <button className="action-btn primary">
              {/* <span className="btn-icon">➕</span> */}
              Add New Asset
            </button>
          </div>
        </div>

        {/* Asset Category Summary Cards */}
        <div className="asset-summary-section">
          {/* <h3>Asset Overview by Category</h3> */}
          <div className="asset-summary-cards">
            {categoryStats.map((stat) => (
              <div key={stat.category} className="asset-summary-card">
                <div className="summary-card-header">
                  {/* <div className="category-icon">
                    {getCategoryIcon(stat.category)}
                  </div> */}
                  <div className="category-info">
                    <h4>{stat.category}s</h4>
                    <div className="assignment-ratio">
                      <span className="assigned-count">{stat.assigned}</span>
                      <span className="ratio-separator">/</span>
                      <span className="total-count">{stat.total}</span>
                      <span className="ratio-label">assigned</span>
                    </div>
                  </div>
                  <div className="percentage-badge">{stat.percentage}%</div>
                </div>
                <div className="summary-card-body">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                  <div className="status-breakdown">
                    <div className="status-item">
                      <span className="status-dot available"></span>
                      <span className="status-text">
                        Available: {stat.available}
                      </span>
                    </div>
                    {stat.maintenance > 0 && (
                      <div className="status-item">
                        <span className="status-dot maintenance"></span>
                        <span className="status-text">
                          Maintenance: {stat.maintenance}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <select
              className="filter-select"
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="laptop">Laptops</option>
              <option value="desktop">Desktops</option>
              <option value="monitor">Monitors</option>
              <option value="mobile">Mobile Devices</option>
            </select>
            <select
              className="filter-select"
              onChange={(e) => setSearchStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
            <input
              type="text"
              className="search-input"
              placeholder="Search assets using name..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Assets Table */}
        <div className="data-table">
          <div className="table-header">
            <div className="table-cell">Asset ID</div>
            <div className="table-cell">Asset Code</div>
            <div className="table-cell">Category</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Assigned To</div>
            <div className="table-cell">Purchase Date</div>
            <div className="table-cell">Actions</div>
          </div>
          {allAssets
            .filter((prod) =>
              search == ""
                ? true
                : prod.category
                    .toLowerCase()
                    .includes(search.toLowerCase().trim()),
            )
            .filter((prod) =>
              searchStatus == "all"
                ? true
                : prod.status.toLowerCase() == searchStatus.toLowerCase(),
            )
            .filter((prod) =>
              searchCategory == "all"
                ? true
                : prod.category.toLowerCase() == searchCategory.toLowerCase(),
            )
            .map((asset) => (
              <div key={asset.id} className="table-row">
                <div className="table-cell">{asset.id}</div>
                <div className="table-cell font-medium">{asset.asset_code}</div>
                <div className="table-cell">{asset.category}</div>
                <div className="table-cell">
                  <span
                    className={`status-badge ${asset.status.toLowerCase()}`}
                  >
                    {asset.status}
                  </span>
                </div>
                <div className="table-cell">{asset.name}</div>
                <div className="table-cell">{asset.purchased_date}</div>
                <div className="table-cell">
                  <div className="action-buttons">
                    <button className="icon-btn edit" title="Edit">
                      edit
                    </button>
                    {/* <button className="icon-btn view" title="View">
                      👁️
                    </button> */}
                    <button className="icon-btn delete" title="Delete">
                      del
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Assets;
