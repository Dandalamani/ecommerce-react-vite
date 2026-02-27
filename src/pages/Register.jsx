import { useState } from "react";
import { registerUser } from "../services/authService";
import "../styles/auth.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔐 OTP states
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {
    if (!form.email) {
      return toast.error("Enter email first");
    }

    try {
      await axios.post(`${API}/api/auth/send-otp`, {
        email: form.email,
      });

      toast.success("OTP sent to email 📧");
      setOtpSent(true);

    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    if (!otp) {
      return toast.error("Enter OTP");
    }

    try {
      await axios.post(`${API}/api/auth/verify-otp`, {
        email: form.email,
        otp,
      });

      toast.success("OTP Verified ✅");
      setVerified(true);

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  /* ================= REGISTER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!verified) {
      return toast.error("Please verify OTP first");
    }

    setLoading(true);

    try {
      await registerUser(form);
      toast.success("Registration successful 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
        />

        {/* EMAIL + SEND OTP */}
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpSent}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "8px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {otpSent ? "Sent" : "Send OTP"}
          </button>
        </div>

        {/* OTP INPUT */}
        {otpSent && (
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={verified}
              style={{
                background: verified ? "green" : "#28a745",
                color: "white",
                border: "none",
                padding: "8px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {verified ? "Verified" : "Verify"}
            </button>
          </div>
        )}

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />

        {/* REGISTER BUTTON */}
        <button disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
