import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/AddDeduction.css";

const AddDeduction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    rate: "",
    amount: "",
    status: "Yes",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing deductions from localStorage
    const existingDeductions = JSON.parse(localStorage.getItem("deductions")) || [];

    // Add new deduction
    const updatedDeductions = [...existingDeductions, formData];

    // Save to localStorage
    localStorage.setItem("deductions", JSON.stringify(updatedDeductions));

    console.log("New Deduction Added:", formData);

    // Redirect to Deductions page
    navigate("/deductions");
  };

  return (
    <div className="add-deduction-wrapper">
      <Sidebar />
      <div className="overlay">
        <div className="add-deduction-modal">
          <h2>Add Deduction</h2>
          <form onSubmit={handleSubmit} className="add-deduction-form">
            <label>Deduction</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Deduction Name"
              required
            />

            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Tax">Tax</option>
              <option value="Statutory">Statutory</option>
              <option value="Insurance">Insurance</option>
              <option value="Loan">Loan</option>
            </select>

            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Health / Personal / Retirement"
              required
            />

            <label>Rate / Percentage</label>
            <input
              type="text"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              placeholder="e.g., 10% or $500"
              required
            />

            <label>Amount</label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount"
              required
            />

            <label>Effective Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <div className="button-group">
              <button type="submit" className="save-btn">
                Save
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/deductions")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDeduction;
