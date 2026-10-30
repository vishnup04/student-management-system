import { useEffect, useState } from "react";
import axios from "axios";
import "./Fees.css";

function Fees() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [fees, setFees] = useState([]);

  const [totalFee, setTotalFee] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!selectedStudent) {
      setFees([]);
      return;
    }

    axios
      .get(`http://localhost:5000/api/fees/${selectedStudent}`)
      .then((response) => {
        setFees(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedStudent]);

  const addFee = async (e) => {
    e.preventDefault();

    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }

    if (Number(amountPaid) > Number(totalFee)) {
      alert("Amount paid cannot be greater than total fee");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/fees", {
        studentId: selectedStudent,
        totalFee: Number(totalFee),
        amountPaid: Number(amountPaid)
      });

      alert("Fee added successfully");

      setTotalFee("");
      setAmountPaid("");

      const response = await axios.get(
        `http://localhost:5000/api/fees/${selectedStudent}`
      );

      setFees(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to add fee");
    }
  };

  const editFee = async (fee) => {
  const newTotalFee = prompt(
    "Enter total fee:",
    fee.totalFee
  );

  if (newTotalFee === null) return;

  const newAmountPaid = prompt(
    "Enter amount paid:",
    fee.amountPaid
  );

  if (newAmountPaid === null) return;

  if (Number(newTotalFee) < 0 || Number(newAmountPaid) < 0) {
    alert("Fee amount cannot be negative");
    return;
  }

  if (Number(newAmountPaid) > Number(newTotalFee)) {
    alert("Amount paid cannot be greater than total fee");
    return;
  }

  try {
    await axios.put(
      `http://localhost:5000/api/fees/${fee._id}`,
      {
        totalFee: Number(newTotalFee),
        amountPaid: Number(newAmountPaid)
      }
    );

    alert("Fee updated successfully");

    const response = await axios.get(
      `http://localhost:5000/api/fees/${selectedStudent}`
    );

    setFees(response.data);

  } catch (error) {
    console.log(error);
    alert("Failed to update fee");
  }
};

  const deleteFee = async (id) => {
    if (!window.confirm("Delete this fee record?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/fees/${id}`);

      setFees(fees.filter((fee) => fee._id !== id));

      alert("Fee deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete fee");
    }
  };

  return (
    <div className="fees-page">

      <div className="fees-header">
        <div>
          <h1>Fees Management</h1>
          <p>Manage student fee payments and balances</p>
        </div>
      </div>

      {/* Student Selection */}
      <div className="fee-card">
        <h2>Select Student</h2>

        <select
          className="fee-select"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">-- Select Student --</option>

          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} - {student.studentId}
            </option>
          ))}
        </select>
      </div>

      {/* Add Fee */}
      <div className="fee-card">
        <h2>Add Fee Payment</h2>

        <form className="fee-form" onSubmit={addFee}>

          <div className="fee-input-group">
            <label>Total Fee</label>

            <input
              type="number"
              min="0"
              value={totalFee}
              onChange={(e) => setTotalFee(e.target.value)}
              placeholder="Enter total fee"
              required
            />
          </div>

          <div className="fee-input-group">
            <label>Amount Paid</label>

            <input
              type="number"
              min="0"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="Enter amount paid"
              required
            />
          </div>

          <button className="add-fee-btn" type="submit">
            + Add Fee
          </button>

        </form>
      </div>

      

      {/* Fee Details */}
      <div className="fee-card">

        <div className="fee-table-header">
          <div>
            <h2>Fee Details</h2>
            <p>Payment history of selected student</p>
          </div>
        </div>

        {fees.length === 0 ? (
          <div className="no-fees">
            <p>No fee records found.</p>
          </div>
        ) : (
          <div className="table-container">

            <table className="fee-table">

              <thead>
                <tr>
                  <th>Total Fee</th>
                  <th>Amount Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {fees.map((fee) => (
                  <tr key={fee._id}>

                    <td>₹{fee.totalFee}</td>

                    <td>₹{fee.amountPaid}</td>

                    <td>₹{fee.balance}</td>

                    <td>
                      <span
                        className={`fee-status ${fee.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {fee.status}
                      </span>
                    </td>

                    <td>
  <button
    className="edit-fee-btn"
    onClick={() => editFee(fee)}
  >
    Edit
  </button>

  <button
    className="delete-fee-btn"
    onClick={() => deleteFee(fee._id)}
  >
    Delete
  </button>
</td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Fees;