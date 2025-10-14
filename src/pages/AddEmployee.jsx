import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/AddEmployee.css";
import { apiUpload } from "../services/api";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

const AddEmployee = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Personal
    first_name: "",
    last_name: "",
    initials: "",
    calling_name: "",
    email: "",
    personal_email: "",
    country_code: "+94",
    phone: "",
    gender: "",
    dob: "",
    marital_status: "",
    nationality: "",
    religion: "",
    nic: "",
    address_permanent: "",
    address_temporary: "",

    // Official
    appointment_date: "",
    department: "",
    designation: "",
    working_office: "",
    branch: "",
    employment_type: "",
    basic_salary: "",
    status: "Active",
    supervisor: "",
    grade: "",
    designated_emails: "",
    epf_no: "",

    // Kin
    kin_name: "",
    kin_relationship: "",
    kin_nic: "",
    kin_dob: "",

    // Bank
    account_number: "",
    account_name: "",
    bank_name: "",
    branch_name: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [bankDocument, setBankDocument] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const validateFiles = () => {
    if (
      profilePhoto &&
      !["image/jpeg", "image/jpg", "image/png"].includes(profilePhoto.type)
    ) {
      setError("Profile photo must be JPG/JPEG/PNG.");
      return false;
    }
    if (
      document &&
      !["application/pdf", "image/jpeg", "image/jpg"].includes(document.type)
    ) {
      setError("Document must be PDF/JPG/JPEG.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFiles()) return;
    setSubmitting(true);
    setError("");

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        fd.append(key, value)
      );
      if (profilePhoto) fd.append("profilePhoto", profilePhoto);
      if (document) fd.append("documents", document);
      if (bankDocument) fd.append("bankDocument", bankDocument);

      await apiUpload("/employees", fd, "POST");
      alert("Employee registered successfully!");
      setStep(1);
    } catch (err) {
      console.error(err);
      setError("Failed to register employee");
    } finally {
      setSubmitting(false);
    }
  };

  // ========== FORM STEPS ==========
  const renderStep = () => {
    switch (step) {
      // ==================== PERSONAL DETAILS ====================
      case 1:
        return (
          <div className="step-section">
            <h2>Personal Details</h2>
            <p className="section-subtitle">Enter employee personal details</p>

            <div className="two-column">
              <input
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
              />
              <input
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
              />

              <input
                name="initials"
                placeholder="Initials"
                value={formData.initials}
                onChange={handleInputChange}
              />
              <input
                name="calling_name"
                placeholder="Calling Name"
                value={formData.calling_name}
                onChange={handleInputChange}
              />

              {/* === Phone number with flag === */}
              <div className="form-group">
               
                <PhoneInput
                  country={"lk"} // default Sri Lanka
                  value={formData.phone}
                  onChange={(phone, countryData) => {
                    setFormData((prev) => ({
                      ...prev,
                      phone: phone,
                      country_code: `+${countryData.dialCode}`,
                    }));
                  }}
                  inputStyle={{
                    width: "100%",
                    height: "42px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                  }}
                  dropdownStyle={{
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Marital Status</option>
                <option value="Married">Married</option>
                <option value="Unmarried">Unmarried</option>
              </select>

              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
              <input
                name="nic"
                placeholder="NIC Number"
                value={formData.nic}
                onChange={handleInputChange}
              />

              <input
                name="email"
                type="email"
                placeholder="Work Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                name="personal_email"
                type="email"
                placeholder="Personal Email"
                value={formData.personal_email}
                onChange={handleInputChange}
              />

              <input
                name="address_permanent"
                placeholder="Permanent Address"
                value={formData.address_permanent}
                onChange={handleInputChange}
              />
              <input
                name="address_temporary"
                placeholder="Temporary Address"
                value={formData.address_temporary}
                onChange={handleInputChange}
              />

              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
              >
                <option value="">Select Nationality</option>
                <option value="Sri Lankan">Sri Lankan</option>
                <option value="Indian">Indian</option>
                <option value="Other">Other</option>
              </select>

              <select
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
              >
                <option value="">Select Religion</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Christianity">Christianity</option>
                <option value="Islam">Islam</option>
              </select>
            </div>
          </div>
        );

      // ==================== OFFICIAL DETAILS ====================
      case 2:
        return (
          <div className="step-section">
            <h2>Official Details</h2>
            <p className="section-subtitle">Enter employee official details</p>

            <div className="two-column">
              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleInputChange}
                placeholder="Appointment Date"
              />
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
                <option value="IT">IT Department</option>
                <option value="Finance">Finance Department</option>
                <option value="HR">Human Resource</option>
                <option value="Sales">Sales Department</option>
                <option value="Admin">Admin Department</option>
              </select>

              <select
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
              >
                <option value="">Select Designation</option>
                <option value="Executive">Executive</option>
                <option value="Manager">Manager</option>
                <option value="Assistant">Assistant</option>
                <option value="Officer">Officer</option>
              </select>

              <select
                name="working_office"
                value={formData.working_office}
                onChange={handleInputChange}
              >
                <option value="">Select Working Office</option>
                <option value="Head Office">Head Office</option>
                <option value="Branch Office">Branch Office</option>
              </select>

              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
              >
                <option value="">Select Branch</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
                <option value="Jaffna">Jaffna</option>
              </select>

              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleInputChange}
              >
                <option value="">Select Employment Type</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Probation">Probation</option>
              </select>

              <input
                type="number"
                name="basic_salary"
                placeholder="Basic Salary"
                value={formData.basic_salary}
                onChange={handleInputChange}
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
              >
                <option value="">Select Grade</option>
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>

              <select
                name="supervisor"
                value={formData.supervisor}
                onChange={handleInputChange}
              >
                <option value="">Select Supervisor</option>
                <option value="Manager">Manager</option>
                <option value="HR Head">HR Head</option>
                <option value="Director">Director</option>
              </select>

              <input
                type="text"
                name="designated_emails"
                placeholder="e.g. user1@mail.com, user2@mail.com"
                value={formData.designated_emails}
                onChange={handleInputChange}
              />

              <input
                type="text"
                name="epf_no"
                placeholder="EPF Number"
                value={formData.epf_no}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );

      // ==================== NEXT OF KIN ====================
      case 3:
        return (
          <div className="step-section">
            <h2>Next of Kin Details</h2>
            <div className="two-column">
              <input
                name="kin_name"
                placeholder="Name"
                onChange={handleInputChange}
              />
              <input
                name="kin_relationship"
                placeholder="Relationship"
                onChange={handleInputChange}
              />
              <input
                name="kin_nic"
                placeholder="NIC"
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="kin_dob"
                placeholder="DOB"
                onChange={handleInputChange}
              />
            </div>
          </div>
        );

      // ==================== BANK DETAILS ====================
      case 4:
        return (
          <div className="step-section">
            <h2>Bank Details</h2>
            <p className="section-subtitle">Enter Employee Bank Details</p>

            <div className="two-column">
              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input
                  name="account_number"
                  placeholder="Enter Account Number"
                  value={formData.account_number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Name</label>
                <input
                  name="account_name"
                  placeholder="Enter Account Holder Name"
                  value={formData.account_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <select
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Bank</option>
                  <option value="Bank of Ceylon">Bank of Ceylon</option>
                  <option value="People's Bank">People's Bank</option>
                  <option value="Commercial Bank">Commercial Bank</option>
                  <option value="Hatton National Bank">Hatton National Bank</option>
                  <option value="Sampath Bank">Sampath Bank</option>
                  <option value="DFCC Bank">DFCC Bank</option>
                  <option value="NDB Bank">NDB Bank</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Branch Name</label>
                <select
                  name="branch_name"
                  value={formData.branch_name}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Matara">Matara</option>
                  <option value="Kurunegala">Kurunegala</option>
                </select>
              </div>
            </div>

            <div className="upload-box" style={{ marginTop: "20px" }}>
              <label>Upload Bank Document (Optional)</label>
              <input
                type="file"
                onChange={(e) => setBankDocument(e.target.files[0])}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>
        );

      // ==================== DOCUMENT UPLOAD ====================
      case 5:
        return (
          <div className="step-section">
            <h2>Documents Upload</h2>
            <div className="upload-box">
              <label>Profile Photo (JPG/JPEG/PNG)</label>
              <input
                type="file"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
              />
              <label>Supporting Documents (PDF/JPG/JPEG)</label>
              <input
                type="file"
                onChange={(e) => setDocument(e.target.files[0])}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ==================== MAIN RETURN ====================
  return (
    <div className="add-employee-container">
      <Sidebar />
      <div className="add-employee-content">
        <h1>Member Registration</h1>
        <div className="stepper">
          {[
            "Personal Details",
            "Official Details",
            "Next of Kin Details",
            "Bank Details",
            "Personal Documents",
          ].map((label, index) => (
            <div
              key={label}
              className={`step ${step === index + 1 ? "active" : ""}`}
            >
              <span>{index + 1}</span> {label}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-text">{error}</p>}
          {renderStep()}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="cancel-btn" onClick={prevStep}>
                Previous
              </button>
            )}
            {step < 5 && (
              <button type="button" className="submit-btn" onClick={nextStep}>
                Save & Next
              </button>
            )}
            {step === 5 && (
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? "Saving..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
