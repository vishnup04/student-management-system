import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddStudent() {
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

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/students",
        student
      );

      alert("Student added successfully!");

      navigate("/students");
    } catch (error) {
      console.error(error);
      alert("Failed to add student");
    }
  };

  return (
    <div className="add-student-page">

      <div className="form-header">
        <div>
          <h1>Add Student</h1>
          <p>Enter student information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="student-form">

        <div className="form-group">
          <label>Student ID</label>
          <input
            type="text"
            name="studentId"
            value={student.studentId}
            onChange={handleChange}
            placeholder="Example: STU001"
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
            placeholder="Enter student name"
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
            placeholder="Enter email"
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
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group full-width">
          <label>Address</label>
          <textarea
            name="address"
            value={student.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>

        <div className="form-group">
          <label>Parent Name</label>
          <input
            type="text"
            name="parentName"
            value={student.parentName}
            onChange={handleChange}
            placeholder="Enter parent name"
          />
        </div>

        <div className="form-group">
          <label>Parent Phone</label>
          <input
            type="text"
            name="parentPhone"
            value={student.parentPhone}
            onChange={handleChange}
            placeholder="Enter parent phone"
          />
        </div>

        <div className="form-group">
          <label>Course</label>
          <input
            type="text"
            name="course"
            value={student.course}
            onChange={handleChange}
            placeholder="Example: MCA"
          />
        </div>

        <div className="form-group">
          <label>Semester</label>
          <input
            type="number"
            name="semester"
            value={student.semester}
            onChange={handleChange}
            placeholder="Example: 2"
            min="1"
            max="10"
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

          <button type="submit" className="save-btn">
            Save Student
          </button>
        </div>

      </form>

    </div>
  );
}

export default AddStudent;