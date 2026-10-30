import { useEffect, useState } from "react";
import axios from "axios";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/students"
        );

        setStudents(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

  const fetchAttendance = async (studentId) => {
    if (!studentId) {
      setAttendance([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/attendance/${studentId}`
      );

      setAttendance(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;

    setSelectedStudent(studentId);
    fetchAttendance(studentId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !date) {
      alert("Please select student and date");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/attendance",
        {
          studentId: selectedStudent,
          date: date,
          status: status
        }
      );

      alert("Attendance added successfully!");

      fetchAttendance(selectedStudent);

      setDate("");
      setStatus("Present");

    } catch (error) {
      console.error(error);
      alert("Failed to add attendance");
    }
  };

  // EDIT ATTENDANCE
  const editAttendance = async (record) => {
    const newStatus = window.prompt(
      "Enter status (Present or Absent):",
      record.status
    );

    if (!newStatus) return;

    if (newStatus !== "Present" && newStatus !== "Absent") {
      alert("Please enter Present or Absent");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/attendance/${record._id}`,
        {
          status: newStatus
        }
      );

      fetchAttendance(selectedStudent);

    } catch (error) {
      console.error(error);
      alert("Failed to update attendance");
    }
  };

  // DELETE ATTENDANCE
  const deleteAttendance = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/attendance/${id}`
      );

      fetchAttendance(selectedStudent);

    } catch (error) {
      console.error(error);
      alert("Failed to delete attendance");
    }
  };

  // CALCULATE ATTENDANCE
  const totalDays = attendance.length;

  const presentDays = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentDays = attendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const percentage =
    totalDays > 0
      ? ((presentDays / totalDays) * 100).toFixed(2)
      : 0;

  return (
    <div className="attendance-page">

      <div className="student-header">
        <div>
          <h1>Attendance</h1>
          <p>Manage student attendance</p>
        </div>
      </div>

      {/* Attendance Form */}

      <form
        onSubmit={handleSubmit}
        className="student-form"
      >

        <div className="form-group">
          <label>Select Student</label>

          <select
            value={selectedStudent}
            onChange={handleStudentChange}
          >
            <option value="">
              Select a student
            </option>

            {students.map((student) => (
              <option
                key={student._id}
                value={student._id}
              >
                {student.studentId} - {student.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div className="form-buttons">

          <button
            type="submit"
            className="save-btn"
          >
            Add Attendance
          </button>

        </div>

      </form>

      {/* Attendance Summary */}

      {selectedStudent && (
        <div className="attendance-summary">

          <div className="attendance-card">
            <h3>Total Days</h3>
            <h2>{totalDays}</h2>
          </div>

          <div className="attendance-card">
            <h3>Present</h3>
            <h2>{presentDays}</h2>
          </div>

          <div className="attendance-card">
            <h3>Absent</h3>
            <h2>{absentDays}</h2>
          </div>

          <div className="attendance-card">
            <h3>Percentage</h3>
            <h2>{percentage}%</h2>
          </div>

        </div>
      )}

      {/* Attendance Table */}

      {selectedStudent && (

        <div className="student-table attendance-table">

          <h2>Attendance Records</h2>

          <table>

            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {attendance.length > 0 ? (

                attendance.map((record) => (

                  <tr key={record._id}>

                    <td>
                      {new Date(record.date).toLocaleDateString()}
                    </td>

                    <td>
                      {record.status}
                    </td>

                    <td>

                      <button
                        className="edit"
                        onClick={() =>
                          editAttendance(record)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete"
                        onClick={() =>
                          deleteAttendance(record._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="3"
                    className="no-data"
                  >
                    No attendance records found
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default Attendance;