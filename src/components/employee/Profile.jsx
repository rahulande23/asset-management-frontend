import { useState, useEffect } from "react";
import API_URL from "../../api";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    position: "",
    joinDate: "",
    phone: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/employee/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile || {});
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/employee/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setIsEditing(false);
        alert("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <>
      <section className="section-header">
        <h2>My Profile</h2>
        <div className="section-actions">
          {!isEditing ? (
            <button
              className="action-btn primary"
              onClick={() => setIsEditing(true)}
            >
              <span className="btn-icon">✏️</span>
              Edit Profile
            </button>
          ) : (
            <button
              className="action-btn secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          )}
        </div>
      </section>

      <section className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "E"}
            </div>
            <h3>{profile.name}</h3>
            <p className="profile-position">{profile.position}</p>
          </div>

          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  className="form-input"
                  value={profile.employeeId}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  name="department"
                  className="form-input"
                  value={profile.department}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  name="position"
                  className="form-input"
                  value={profile.position}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Join Date</label>
                <input
                  type="text"
                  name="joinDate"
                  className="form-input"
                  value={profile.joinDate}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={profile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            {isEditing && (
              <div className="form-actions">
                <button type="submit" className="action-btn primary">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

export default Profile;
