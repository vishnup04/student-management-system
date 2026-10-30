import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <nav className="home-navbar">
        <h2>StudentMS</h2>
        <Link to="/login" className="home-login-btn">
          Login
        </Link>
      </nav>

      <section className="home-hero">
        <div className="home-content">
          <p className="home-tagline">SMART • SIMPLE • DIGITAL</p>

          <h1>
            Welcome to <span>StudentMS</span>
          </h1>

          <p className="home-description">
            A simple and smart way to manage student details,
            attendance, internal marks and fee records — all in one place.
          </p>

          <Link to="/login" className="home-start-btn">
            Login to Continue →
          </Link>
        </div>

        <div className="home-icon">
          🎓
          <div className="home-icon-caption">
            <h3>Student Management System</h3>
            <p>One platform. Everything organized.</p>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="home-feature">
          <span>👨‍🎓</span>
          <h3>Student Details</h3>
          <p>Keep student information organized.</p>
        </div>

        <div className="home-feature">
          <span>📊</span>
          <h3>Attendance</h3>
          <p>View and manage attendance records.</p>
        </div>

        <div className="home-feature">
          <span>📝</span>
          <h3>Internal Marks</h3>
          <p>Access subject-wise internal marks.</p>
        </div>

        <div className="home-feature">
          <span>💰</span>
          <h3>Fee Details</h3>
          <p>Track paid fees and outstanding balances.</p>
        </div>
      </section>

      <footer className="home-footer">
        © 2026 StudentMS | Student Management System
      </footer>
    </div>
  );
}

export default Home;