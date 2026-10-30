import { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [fees, setFees] = useState([]);
  const [loadingError, setLoadingError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.studentId) {
      setLoadingError("Student account information is missing. Please log in again.");
      return;
    }

    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          axios.get(`http://localhost:5000/api/students/${user.studentId}`),
          axios.get(`http://localhost:5000/api/attendance/${user.studentId}`),
          axios.get(`http://localhost:5000/api/marks/${user.studentId}`),
          axios.get(`http://localhost:5000/api/fees/${user.studentId}`),
        ]);

        if (results[0].status === "fulfilled") {
          setStudent(results[0].value.data);
        } else {
          setLoadingError("Unable to load your student details.");
        }

        if (results[1].status === "fulfilled") {
          setAttendance(Array.isArray(results[1].value.data) ? results[1].value.data : []);
        }

        if (results[2].status === "fulfilled") {
          setMarks(Array.isArray(results[2].value.data) ? results[2].value.data : []);
        }

        if (results[3].status === "fulfilled") {
          setFees(Array.isArray(results[3].value.data) ? results[3].value.data : []);
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);
        setLoadingError("Something went wrong while loading your dashboard.");
      }
    };

    fetchData();
  }, []);

  if (loadingError && !student) {
    return <div className="student-loading student-error">{loadingError}</div>;
  }

  if (!student) {
    return <div className="student-loading">Loading your dashboard...</div>;
  }

  const presentCount = attendance.filter(
    (record) => record.status?.toLowerCase() === "present"
  ).length;

  const attendancePercentage =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0;

  const totalMarks = marks.reduce(
    (sum, mark) => sum + (Number(mark.total) || 0),
    0
  );

  const averageMarks =
    marks.length > 0 ? Math.round(totalMarks / marks.length) : 0;

  const totalFees = fees.reduce(
    (sum, fee) => sum + (Number(fee.totalFee) || 0),
    0
  );

  const amountPaid = fees.reduce(
    (sum, fee) => sum + (Number(fee.amountPaid) || 0),
    0
  );

  const balance = fees.reduce(
    (sum, fee) => sum + (Number(fee.balance) || 0),
    0
  );

  const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "—";

  return (
    <div className="student-dashboard">
      {/* Welcome banner */}
      <section className="student-welcome">
        <div>
          <span className="student-eyebrow">STUDENT PORTAL</span>
          <h1>Welcome back, {student.name}! 👋</h1>
          <p>Here is your academic progress at a glance.</p>
        </div>

        <div className="student-avatar">
          {student.name?.charAt(0)?.toUpperCase() || "S"}
        </div>
      </section>

      {/* Summary cards */}
      <section className="student-summary">
        <article className="student-summary-card summary-attendance">
          <div className="summary-icon">📊</div>
          <p>Attendance</p>
          <h2>{attendancePercentage}%</h2>
          <span>
            {presentCount} of {attendance.length} recorded days present
          </span>
        </article>

        <article className="student-summary-card summary-marks">
          <div className="summary-icon">📝</div>
          <p>Subjects with marks</p>
          <h2>{marks.length}</h2>
          <span>Average total: {averageMarks}</span>
        </article>

        <article className="student-summary-card summary-fees">
          <div className="summary-icon">💳</div>
          <p>Fees Paid</p>
          <h2>{money(amountPaid)}</h2>
          <span>Balance: {money(balance)}</span>
        </article>
      </section>

      {/* Student profile */}
      <section className="student-panel">
        <div className="student-panel-heading">
          <div>
            <h2>👤 My Profile</h2>
            <p>Your registered student information</p>
          </div>
          <span className="student-id-badge">
            {student.studentId || "Student"}
          </span>
        </div>

        <div className="student-profile-grid">
          <div className="profile-item">
            <span>Full Name</span>
            <strong>{student.name || "—"}</strong>
          </div>

          <div className="profile-item">
            <span>Email Address</span>
            <strong>{student.email || "—"}</strong>
          </div>

          <div className="profile-item">
            <span>Phone Number</span>
            <strong>{student.phone || "—"}</strong>
          </div>

          <div className="profile-item">
            <span>Course</span>
            <strong>{student.course || "—"}</strong>
          </div>

          <div className="profile-item">
            <span>Semester</span>
            <strong>{student.semester || "—"}</strong>
          </div>

          <div className="profile-item">
            <span>Address</span>
            <strong>{student.address || "—"}</strong>
          </div>

          <div className="profile-item">
            <span>Parent / Guardian</span>
            <strong>{student.parentName || "—"}</strong>
          </div>

          <div className="profile-item">
            <span>Parent Phone</span>
            <strong>{student.parentPhone || "—"}</strong>
          </div>
        </div>
      </section>

      {/* Attendance */}
      <section className="student-panel">
        <div className="student-panel-heading">
          <div>
            <h2>📅 Attendance Overview</h2>
            <p>Your recorded attendance details</p>
          </div>
          <span className="student-count">{attendance.length} records</span>
        </div>

        {attendance.length === 0 ? (
          <div className="student-empty">No attendance records found yet.</div>
        ) : (
          <div className="student-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id}>
                    <td>{formatDate(record.date)}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          record.status?.toLowerCase() === "present"
                            ? "status-present"
                            : "status-absent"
                        }`}
                      >
                        {record.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Internal marks */}
      <section className="student-panel">
        <div className="student-panel-heading">
          <div>
            <h2>📝 Internal Marks</h2>
            <p>Review your subject-wise performance</p>
          </div>
          <span className="student-count">{marks.length} subjects</span>
        </div>

        {marks.length === 0 ? (
          <div className="student-empty">No marks have been added yet.</div>
        ) : (
          <div className="student-table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Internal 1</th>
                  <th>Internal 2</th>
                  <th>Assignment</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark) => (
                  <tr key={mark._id}>
                    <td className="subject-name">{mark.subject}</td>
                    <td>{mark.internal1 ?? 0} / 30</td>
                    <td>{mark.internal2 ?? 0} / 30</td>
                    <td>{mark.assignment ?? 0} / 10</td>
                    <td>
                      <span className="marks-badge">{mark.total ?? 0} / 70</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Fees */}
      <section className="student-panel">
        <div className="student-panel-heading">
          <div>
            <h2>💰 Fee Details</h2>
            <p>Track your fee payments and outstanding balance</p>
          </div>
          <span className="student-count">{fees.length} records</span>
        </div>

        {fees.length === 0 ? (
          <div className="student-empty">No fee records found yet.</div>
        ) : (
          <>
            <div className="fee-progress-section">
              <div className="fee-progress-label">
                <span>Payment progress</span>
                <strong>
                  {totalFees > 0
                    ? Math.round((amountPaid / totalFees) * 100)
                    : 0}%
                </strong>
              </div>
              <div className="fee-progress-track">
                <div
                  className="fee-progress-fill"
                  style={{
                    width: `${
                      totalFees > 0
                        ? Math.min(100, (amountPaid / totalFees) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="student-table-wrapper">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Total Fee</th>
                    <th>Amount Paid</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee) => (
                    <tr key={fee._id}>
                      <td>{money(fee.totalFee)}</td>
                      <td className="paid-amount">{money(fee.amountPaid)}</td>
                      <td>{money(fee.balance)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            fee.status?.toLowerCase() === "paid"
                              ? "status-present"
                              : "status-pending"
                          }`}
                        >
                          {fee.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <footer className="student-dashboard-footer">
        Student Management System · Your academic journey, all in one place.
      </footer>
    </div>
  );
}

export default StudentDashboard;
