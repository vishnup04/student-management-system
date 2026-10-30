
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";

import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import Fees from "./pages/Fees";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import Home from "./pages/Home";
import "./App.css";
import Register from "./pages/Register";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <p className="dashboard-label">TEACHER PORTAL</p>
          <h1>Welcome back{user?.name ? `, ${user.name}` : ""}! 👋</h1>
          <p>Manage your students and academic records in one place.</p>
        </div>
        <div className="dashboard-date">📅 {today}</div>
      </div>

      <div className="dashboard-section-heading">
        <h2>Overview</h2>
        <p>Quick access to your college management tools.</p>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-stat-card students-card">
          <div className="dashboard-stat-icon">🎓</div>
          <h3>Students</h3>
          <p>Manage student records</p>
          <Link to="/students">View Students →</Link>
        </div>

        <div className="dashboard-stat-card attendance-card">
          <div className="dashboard-stat-icon">📅</div>
          <h3>Attendance</h3>
          <p>Track student attendance</p>
          <Link to="/attendance">Manage Attendance →</Link>
        </div>

        <div className="dashboard-stat-card marks-card">
          <div className="dashboard-stat-icon">📝</div>
          <h3>Internal Marks</h3>
          <p>Manage academic performance</p>
          <Link to="/marks">View Marks →</Link>
        </div>

        <div className="dashboard-stat-card fees-card">
          <div className="dashboard-stat-icon">💳</div>
          <h3>Fees</h3>
          <p>Track student fee payments</p>
          <Link to="/fees">Manage Fees →</Link>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="dashboard-info-card">
          <h2>Quick Actions ⚡</h2>
          <p>Complete common tasks quickly.</p>

          <Link className="dashboard-action" to="/add-student">
            <span>➕</span>
            <span>
              <strong>Add New Student</strong>
              <small>Create a student record</small>
            </span>
            <span className="action-arrow">→</span>
          </Link>

          <Link className="dashboard-action" to="/students">
            <span>👥</span>
            <span>
              <strong>View All Students</strong>
              <small>Search and update student details</small>
            </span>
            <span className="action-arrow">→</span>
          </Link>

          <Link className="dashboard-action" to="/attendance">
            <span>📋</span>
            <span>
              <strong>Update Attendance</strong>
              <small>Manage attendance records</small>
            </span>
            <span className="action-arrow">→</span>
          </Link>
        </div>

        <div className="dashboard-info-card dashboard-tip">
          <div className="dashboard-tip-icon">💡</div>
          <h2>Stay Organized</h2>
          <p>
            Keep student details, attendance, internal marks, and fee
            records updated to make academic management easier.
          </p>
          <div className="dashboard-tip-footer">
            <span>✓</span> Everything in one place
          </div>
        </div>
      </div>
    </div>
  );
}


function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    if (user.role === "student") {
      return <Navigate to="/student-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

function AppLayout() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // Hide the sidebar on Home and Login pages
 const hideSidebar =
  location.pathname === "/" ||
  location.pathname === "/login" ||
  location.pathname === "/register" ||
  !user;

  return (
    <div className={hideSidebar ? "public-app" : "app"}>
      {!hideSidebar && (
        <aside className="sidebar">
          <h2>StudentMS</h2>

          <nav>
            {user.role === "teacher" ? (
              <>
                <Link to="/">Home</Link>
                <Link to="/students">Students</Link>
                <Link to="/attendance">Attendance</Link>
                <Link to="/marks">Marks</Link>
                <Link to="/fees">Fees</Link>
              </>
            ) : (
              <Link to="/student-dashboard">My Dashboard</Link>
            )}
          </nav>

          <button
            className="logout"
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </aside>
      )}

      <main className={hideSidebar ? "public-main" : "main"}>
        <Routes>
         
<Route path="/" element={<Home />} />

<Route
  path="/teacher-dashboard"
  element={
    <ProtectedRoute role="teacher">
      <Dashboard />
    </ProtectedRoute>
  }
/>


          <Route
            path="/students"
            element={
              <ProtectedRoute role="teacher">
                <Students />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-student"
            element={
              <ProtectedRoute role="teacher">
                <AddStudent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-student/:id"
            element={
              <ProtectedRoute role="teacher">
                <EditStudent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute role="teacher">
                <Attendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/marks"
            element={
              <ProtectedRoute role="teacher">
                <Marks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fees"
            element={
              <ProtectedRoute role="teacher">
                <Fees />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute role="teacher">
                <Dashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
