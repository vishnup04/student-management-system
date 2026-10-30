import { useEffect, useState } from "react";
import axios from "axios";

function Marks() {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState("");

  const [subject, setSubject] = useState("");
  const [internal1, setInternal1] = useState("");
  const [internal2, setInternal2] = useState("");
  const [assignment, setAssignment] = useState("");

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

  const fetchMarks = async (studentId) => {
    if (!studentId) {
      setMarks([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/marks/${studentId}`
      );

      setMarks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;

    setSelectedStudent(studentId);
    fetchMarks(studentId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !subject) {
      alert("Please select student and enter subject");
      return;
    }

    const total =
      Number(internal1 || 0) +
      Number(internal2 || 0) +
      Number(assignment || 0);

    try {
      await axios.post(
        "http://localhost:5000/api/marks",
        {
          studentId: selectedStudent,
          subject: subject,
          internal1: Number(internal1 || 0),
          internal2: Number(internal2 || 0),
          assignment: Number(assignment || 0),
          total: total
        }
      );

      alert("Marks added successfully!");

      fetchMarks(selectedStudent);

      setSubject("");
      setInternal1("");
      setInternal2("");
      setAssignment("");

   } catch (error) {
  console.log("FULL ERROR:", error);

  if (error.response) {
    alert(
      "Status: " +
      error.response.status +
      "\nMessage: " +
      JSON.stringify(error.response.data)
    );
  } else if (error.request) {
    alert(
      "Request was sent, but the backend did not respond."
    );
  } else {
    alert(
      "Error: " + error.message
    );
  }
}
  };

  // EDIT MARKS
  const editMarks = async (record) => {
    const newInternal1 = window.prompt(
      "Enter Internal 1 marks:",
      record.internal1
    );

    if (newInternal1 === null) return;

    const newInternal2 = window.prompt(
      "Enter Internal 2 marks:",
      record.internal2
    );

    if (newInternal2 === null) return;

    const newAssignment = window.prompt(
      "Enter Assignment marks:",
      record.assignment
    );

    if (newAssignment === null) return;

    const total =
      Number(newInternal1) +
      Number(newInternal2) +
      Number(newAssignment);

    try {
      await axios.put(
        `http://localhost:5000/api/marks/${record._id}`,
        {
          internal1: Number(newInternal1),
          internal2: Number(newInternal2),
          assignment: Number(newAssignment),
          total: total
        }
      );

      fetchMarks(selectedStudent);

    } catch (error) {
      console.error(error);
      alert("Failed to update marks");
    }
  };

  // DELETE MARKS
  const deleteMarks = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete these marks?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/marks/${id}`
      );

      fetchMarks(selectedStudent);

    } catch (error) {
      console.error(error);
      alert("Failed to delete marks");
    }
  };

  return (
    <div className="marks-page">

      <div className="student-header">
        <div>
          <h1>Marks</h1>
          <p>Manage student internal marks</p>
        </div>
      </div>

      {/* Marks Form */}

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
          <label>Subject</label>

          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Example: Java"
          />
        </div>

        <div className="form-group">
          <label>Internal 1</label>

         <input
  type="number"
  min="0"
  max="20"
  value={internal1}
  onChange={(e) => setInternal1(e.target.value)}
/>
        </div>

        <div className="form-group">
          <label>Internal 2</label>

          <input
  type="number"
  min="0"
  max="20"
  value={internal2}
  onChange={(e) => setInternal2(e.target.value)}
/>
        </div>

        <div className="form-group">
          <label>Assignment</label>

          <input
  type="number"
  min="0"
  max="10"
  value={assignment}
  onChange={(e) => setAssignment(e.target.value)}
/>
        </div>

        <div className="form-buttons">

          <button
            type="submit"
            className="save-btn"
          >
            Add Marks
          </button>

        </div>

      </form>

      {/* Marks Table */}

      {selectedStudent && (

        <div className="student-table marks-table">

          <h2>Marks Records</h2>

          <table>

            <thead>
              <tr>
                <th>Subject</th>
                <th>Internal 1</th>
                <th>Internal 2</th>
                <th>Assignment</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {marks.length > 0 ? (

                marks.map((record) => (

                  <tr key={record._id}>

                    <td>{record.subject}</td>

                    <td>{record.internal1}</td>

                    <td>{record.internal2}</td>

                    <td>{record.assignment}</td>

                    <td>
                      <strong>{record.total}</strong>
                    </td>

                    <td>

                      <button
                        className="edit"
                        onClick={() =>
                          editMarks(record)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete"
                        onClick={() =>
                          deleteMarks(record._id)
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
                    colSpan="6"
                    className="no-data"
                  >
                    No marks records found
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

export default Marks;