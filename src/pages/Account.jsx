import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Account() {
  // Load user from localStorage or set defaults
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) return JSON.parse(savedProfile);
    return {
      name: authUser?.name || "User",
      email: authUser?.email || "",
      address: "Hyderabad, India",
      joined: "January 2024",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    };
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  // Save user to localStorage when updated
  useEffect(() => {
    if (authUser) {
      setUser((prev) => ({
        ...prev,
        name: authUser.name,
        email: authUser.email,
      }));
    }
  }, [authUser]);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(user));
  }, [user]);
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    setUser(editForm);
updateUser({
  name: editForm.name,
  email: editForm.email,
});
    setIsEditing(false);
    toast.success("✅ Profile updated successfully!");
  };
  // ✅ Handle avatar upload (save base64 string)
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedUser = { ...user, avatar: reader.result };
      setUser(updatedUser);
      localStorage.setItem("userProfile", JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };
  if (!authUser) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Please login to view your profile</h2>
      </div>
    );
  }
  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "#f8f9fa",
        color: "#333",
      }}
    >
      {/* Profile Card */}
      <section
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "10px",
          maxWidth: "450px",
          margin: "0 auto",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={user.avatar}
            alt="User Avatar"
            style={{
              borderRadius: "50%",
              width: "120px",
              height: "120px",
              objectFit: "cover",
              border: "2px solid #ccc",
            }}
          />
          {/* Upload Button */}
          <label
            htmlFor="avatarUpload"
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              background: "#007bff",
              color: "white",
              padding: "5px 8px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "14px",
            }}
            title="Change profile photo"
          >
            📷
          </label>
          <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarUpload}
          />
        </div>
        {!isEditing ? (
          <>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>📍 {user.address}</p>
            <p>Joined: {user.joined}</p>
            <button
              style={buttonStyle("#007bff")}
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <>
            <h2>Edit Profile</h2>
            <div style={{ textAlign: "left", marginTop: "1rem" }}>
              <label>Name:</label>
              <input
                name="name"
                value={editForm.name}
                onChange={handleChange}
                style={inputStyle}
              />
              <label>Email:</label>
              <input
                name="email"
                value={editForm.email}
                onChange={handleChange}
                style={inputStyle}
              />
              <label>Address:</label>
              <input
                name="address"
                value={editForm.address}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button onClick={handleSave} style={buttonStyle("green")}>
                💾 Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditForm(user);
                }}
                style={buttonStyle("gray")}
              >
                ❌ Cancel
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  marginBottom: "10px",
  marginTop: "5px",
};
const buttonStyle = (color) => ({
  background: color,
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  marginRight: "10px",
  cursor: "pointer",
});
export default Account;