function Maintenance({}) {
  return (
    <>
      <div className="maintenance-section">
        <div className="section-header">
          <h2>Maintenance Management</h2>
          <div className="section-actions">
            <button className="action-btn primary">
              <span className="btn-icon">🔧</span>
              Schedule Maintenance
            </button>
          </div>
        </div>

        {/* Maintenance Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔧</div>
            <div className="stat-content">
              <h3>In Maintenance</h3>
              <p className="stat-number">12</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>Scheduled</h3>
              <p className="stat-number">8</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Completed</h3>
              <p className="stat-number">45</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>Overdue</h3>
              <p className="stat-number">3</p>
            </div>
          </div>
        </div>

        {/* Maintenance Table */}
        <div className="data-table">
          <div className="table-header">
            <div className="table-cell">Asset</div>
            <div className="table-cell">Type</div>
            <div className="table-cell">Scheduled Date</div>
            <div className="table-cell">Technician</div>
            <div className="table-cell">Priority</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Actions</div>
          </div>
          {[
            {
              asset: "HP Desktop (AST004)",
              type: "Preventive",
              scheduledDate: "2024-01-20",
              technician: "Tech Team A",
              priority: "Medium",
              status: "In Progress",
            },
            {
              asset: "Dell Laptop (AST007)",
              type: "Repair",
              scheduledDate: "2024-01-18",
              technician: "Tech Team B",
              priority: "High",
              status: "Scheduled",
            },
            {
              asset: "Printer Canon (AST008)",
              type: "Preventive",
              scheduledDate: "2024-01-15",
              technician: "Tech Team A",
              priority: "Low",
              status: "Completed",
            },
            {
              asset: "MacBook Air (AST009)",
              type: "Repair",
              scheduledDate: "2024-01-12",
              technician: "Tech Team C",
              priority: "High",
              status: "Overdue",
            },
          ].map((maintenance, index) => (
            <div key={index} className="table-row">
              <div className="table-cell font-medium">{maintenance.asset}</div>
              <div className="table-cell">{maintenance.type}</div>
              <div className="table-cell">{maintenance.scheduledDate}</div>
              <div className="table-cell">{maintenance.technician}</div>
              <div className="table-cell">
                <span
                  className={`priority-badge ${maintenance.priority.toLowerCase()}`}
                >
                  {maintenance.priority}
                </span>
              </div>
              <div className="table-cell">
                <span
                  className={`status-badge ${maintenance.status.toLowerCase().replace(" ", "-")}`}
                >
                  {maintenance.status}
                </span>
              </div>
              <div className="table-cell">
                <div className="action-buttons">
                  <button className="icon-btn edit" title="Edit">
                    ✏️
                  </button>
                  {/* <button className="icon-btn view" title="View">
                      👁️
                    </button> */}
                  <button className="icon-btn complete" title="Complete">
                    ✅
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

export default Maintenance;
