import { useState } from "react";

function Settings({}) {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <div className="settings-section">
        <div className="section-header">
          <h2>Settings</h2>
          <div className="section-actions">
            <button className="action-btn primary">
              <span className="btn-icon">💾</span>
              Save Changes
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">🔄</span>
              Reset to Default
            </button>
          </div>
        </div>

        {/* Settings Categories */}
        <div className="settings-grid">
          <div className="settings-card">
            <h3>🎨 Appearance</h3>
            <div className="setting-item">
              <label className="setting-label">Theme</label>
              <select
                className="setting-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
            <div className="setting-item">
              <label className="setting-label">Language</label>
              <select
                className="setting-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div className="setting-item">
              <label className="setting-label">Date Format</label>
              <select className="setting-select">
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>

          <div className="settings-card">
            <h3>🔔 Notifications</h3>
            <div className="setting-item">
              <label className="setting-label">Email Notifications</label>
              <input
                type="checkbox"
                className="setting-checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </div>
            <div className="setting-item">
              <label className="setting-label">Desktop Notifications</label>
              <input
                type="checkbox"
                className="setting-checkbox"
                defaultChecked
              />
            </div>
            <div className="setting-item">
              <label className="setting-label">Sound Alerts</label>
              <input
                type="checkbox"
                className="setting-checkbox"
                defaultChecked
              />
            </div>
          </div>

          <div className="settings-card">
            <h3>⚙️ General</h3>
            <div className="setting-item">
              <label className="setting-label">Company Name</label>
              <input
                type="text"
                className="setting-input"
                defaultValue="AssetManager Pro"
              />
            </div>
            <div className="setting-item">
              <label className="setting-label">Time Zone</label>
              <select className="setting-select">
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="MST">Mountain Time (MST)</option>
              </select>
            </div>
            <div className="setting-item">
              <label className="setting-label">Auto-save Changes</label>
              <input
                type="checkbox"
                className="setting-checkbox"
                defaultChecked
              />
            </div>
          </div>

          <div className="settings-card">
            <h3>👤 Account</h3>
            <div className="setting-item">
              <label className="setting-label">Change Password</label>
              <button className="setting-btn">Update Password</button>
            </div>
            <div className="setting-item">
              <label className="setting-label">Two-Factor Authentication</label>
              <button className="setting-btn secondary">Enable 2FA</button>
            </div>
            <div className="setting-item">
              <label className="setting-label">Session Timeout</label>
              <select className="setting-select">
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120" selected>
                  2 hours
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="settings-quick-actions">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <span className="action-icon">🗑️</span>
              <span className="action-text">Clear Cache</span>
            </button>
            <button className="quick-action-btn">
              <span className="action-icon">🔄</span>
              <span className="action-text">Refresh Data</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
