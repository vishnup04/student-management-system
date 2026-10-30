import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Students() {
    const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  // Get students from backend
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/students"
      );

      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search students
  const searchStudents = async (value) => {
    setSearch(value);

    if (value.trim() === "") {
      fetchStudents();
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/students/search?q=${value}`
      );

      setStudents(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Delete student
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/students/${id}`
      );

      fetchStudents();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="student-page">

      <div className="student-header">
        <div>
          <h1>Students</h1>
          <p>Manage student information</p>
        </div>

        <button
         className="add-btn"
        onClick={() => navigate("/add-student")}
>
         + Add Student
    </button>
      </div>

      <input
        type="text"
        className="search"
        placeholder="🔍 Search by name, ID, course or phone..."
        value={search}
        onChange={(e) => searchStudents(e.target.value)}
      />

      <div className="student-table">

        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student._id}>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.semester}</td>
                  <td>{student.phone}</td>

                  <td>
                    <button
             className="edit"
            onClick={() =>
            navigate(`/edit-student/${student._id}`)
        }
>
            Edit
            </button>

                    <button
                      className="delete"
                      onClick={() =>
                        deleteStudent(student._id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Students;