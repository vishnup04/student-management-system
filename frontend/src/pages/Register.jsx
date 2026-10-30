import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          studentId,
          email,
          password,
        }
      );

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <Link to="/" className="register-back">
          ← Back to Home
        </Link>

        <div className="register-icon">🎓</div>

        <h1>Create Account</h1>
        <p className="register-subtitle">
          Join your Student Management System
        </p>

        <form onSubmit={handleRegister}>
          <div className="register-field">
            <label htmlFor="studentId">Student ID</label>
            <input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your student ID"
              autoComplete="username"
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="email">Registered Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              autoComplete="email"
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="password">Create Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              minLength={8}
              autoComplete="new-password"
              required
            />
            <small>Use at least 8 characters.</small>
          </div>

          {message && (
            <div className="register-error" role="alert">
              {message}
            </div>
          )}

          <button
            className="register-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <p className="register-login">
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>

        <p className="register-footer">
          Student Management System
        </p>
      </div>
    </div>
  );
}

export default Register;
