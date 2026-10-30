import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    parentName: "",
    parentPhone: "",
    course: "",
    semester: ""
  });

  // Get student details
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/students/${id}`
        );

        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchStudent();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  };

  // Update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/students/${id}`,
        student
      );

      alert("Student updated successfully!");

      navigate("/students");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update student");
    }
  };

  return (
    <div className="add-student-page">

      <div className="form-header">
        <h1>Edit Student</h1>
        <p>Update student information</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="student-form"
      >

        <div className="form-group">
          <label>Student ID</label>
          <input
            type="text"
            name="studentId"
            value={student.studentId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Student Name</label>
          <input
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={student.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label>Address</label>
          <textarea
            name="address"
            value={student.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Parent Name</label>
          <input
            type="text"
            name="parentName"
            value={student.parentName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Parent Phone</label>
          <input
            type="text"
            name="parentPhone"
            value={student.parentPhone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Course</label>
          <input
            type="text"
            name="course"
            value={student.course}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Semester</label>
          <input
            type="number"
            name="semester"
            value={student.semester}
            onChange={handleChange}
          />
        </div>

        <div className="form-buttons">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/students")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-btn"
          >
            Update Student
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditStudent;