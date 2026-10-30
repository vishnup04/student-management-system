
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const user = response.data.user;

      if (user.role !== role) {
        alert(`This account is not a ${role} account`);
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");

      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher-dashboard");
      }
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>StudentMS</h1>

        <p className="login-subtitle">
          Student Management System
        </p>

        <div className="role-buttons">
          <button
            type="button"
            className={role === "teacher" ? "active-role" : ""}
            onClick={() => setRole("teacher")}
          >
            👨‍🏫 Teacher
          </button>

          <button
            type="button"
            className={role === "student" ? "active-role" : ""}
            onClick={() => setRole("student")}
          >
            👨‍🎓 Student
          </button>
        </div>

        <h2>
          {role === "teacher"
            ? "Teacher Login"
            : "Student Login"}
        </h2>

        <form onSubmit={handleLogin}>
          <div className="login-input">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {role === "student" && (
          <p className="register-link">
            New student?
            <Link to="/register">Register here</Link>
            </p> 
        )}

        <p className="back-home">
         <Link to="/" className="back-home-link">
        ← Back to Home
      </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
