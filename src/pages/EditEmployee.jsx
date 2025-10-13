import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/AddEmployee.css";
import { apiGet, apiUpload } from "../services/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  // ✅ Fetch employee data on load
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await apiGet(`/employees/${id}`);
        const data = res.data || {};
        setFormData({
          ...formData,
          ...data,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  // ✅ Save (PUT)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateFiles()) return;
    setSaving(true);
    setError("");

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        fd.append(key, value ?? "")
      );
      if (profilePhoto) fd.append("profilePhoto", profilePhoto);
      if (document) fd.append("documents", document);
      if (bankDocument) fd.append("bankDocument", bankDocument);

      await apiUpload(`/employees/${id}`, fd, "PUT");
      alert("Employee updated successfully!");
      navigate("/employee-info");
    } catch (err) {
      console.error(err);
      setError("Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await apiGet(`/employees/${id}`, { method: "DELETE" });
      alert("Employee deleted successfully!");
      navigate("/employee-info");
    } catch (err) {
      console.error(err);
      setError("Failed to delete employee");
    }
  };

  if (loading) return <div className="edit-loading">Loading…</div>;

  // ✅ FORM SECTIONS (same as AddEmployee)
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-section">
            <h2>Personal Details</h2>
            <p className="section-subtitle">Edit employee personal details</p>
            <div className="two-column">
              <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleInputChange} />
              <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleInputChange} />
              <input name="initials" placeholder="Initials" value={formData.initials} onChange={handleInputChange} />
              <input name="calling_name" placeholder="Calling Name" value={formData.calling_name} onChange={handleInputChange} />

              <PhoneInput
                country={"lk"}
                value={formData.phone}
                onChange={(phone, countryData) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone,
                    country_code: `+${countryData.dialCode}`,
                  }))
                }
                inputStyle={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                }}
              />

              <select name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <input type="date" name="dob" value={formData.dob?.slice(0, 10)} onChange={handleInputChange} />
              <input name="nic" placeholder="NIC" value={formData.nic} onChange={handleInputChange} />
              <input name="email" type="email" placeholder="Work Email" value={formData.email} onChange={handleInputChange} />
              <input name="personal_email" type="email" placeholder="Personal Email" value={formData.personal_email} onChange={handleInputChange} />
              <input name="address_permanent" placeholder="Permanent Address" value={formData.address_permanent} onChange={handleInputChange} />
              <input name="address_temporary" placeholder="Temporary Address" value={formData.address_temporary} onChange={handleInputChange} />
              <select name="nationality" value={formData.nationality} onChange={handleInputChange}>
                <option value="">Select Nationality</option>
                <option value="Sri Lankan">Sri Lankan</option>
                <option value="Indian">Indian</option>
              </select>
              <select name="religion" value={formData.religion} onChange={handleInputChange}>
                <option value="">Select Religion</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Christianity">Christianity</option>
                <option value="Islam">Islam</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-section">
            <h2>Official Details</h2>
            <div className="two-column">
              <input type="date" name="appointment_date" value={formData.appointment_date?.slice(0, 10)} onChange={handleInputChange} />
              <select name="department" value={formData.department} onChange={handleInputChange}>
                <option value="">Select Department</option>
                <option value="IT">IT Department</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
              <select name="designation" value={formData.designation} onChange={handleInputChange}>
                <option value="">Select Designation</option>
                <option value="Executive">Executive</option>
                <option value="Manager">Manager</option>
                <option value="Assistant">Assistant</option>
              </select>
              <select name="employment_type" value={formData.employment_type} onChange={handleInputChange}>
                <option value="">Select Employment Type</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
              </select>
              <input name="basic_salary" type="number" placeholder="Basic Salary" value={formData.basic_salary} onChange={handleInputChange} />
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input name="supervisor" placeholder="Supervisor" value={formData.supervisor} onChange={handleInputChange} />
              <input name="epf_no" placeholder="EPF No" value={formData.epf_no} onChange={handleInputChange} />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-section">
            <h2>Next of Kin Details</h2>
            <div className="two-column">
              <input name="kin_name" placeholder="Name" value={formData.kin_name} onChange={handleInputChange} />
              <input name="kin_relationship" placeholder="Relationship" value={formData.kin_relationship} onChange={handleInputChange} />
              <input name="kin_nic" placeholder="NIC" value={formData.kin_nic} onChange={handleInputChange} />
              <input type="date" name="kin_dob" value={formData.kin_dob?.slice(0, 10)} onChange={handleInputChange} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-section">
            <h2>Bank Details</h2>
            <div className="two-column">
              <input name="account_number" placeholder="Account Number" value={formData.account_number} onChange={handleInputChange} />
              <input name="account_name" placeholder="Account Holder Name" value={formData.account_name} onChange={handleInputChange} />
              <input name="bank_name" placeholder="Bank Name" value={formData.bank_name} onChange={handleInputChange} />
              <input name="branch_name" placeholder="Branch Name" value={formData.branch_name} onChange={handleInputChange} />
            </div>
            <div className="upload-box">
              <label>Upload Bank Document (Optional)</label>
              <input type="file" onChange={(e) => setBankDocument(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-section">
            <h2>Documents Upload</h2>
            <div className="upload-box">
              <label>Profile Photo (JPG/JPEG/PNG)</label>
              <input type="file" onChange={(e) => setProfilePhoto(e.target.files[0])} />
              <label>Supporting Documents (PDF/JPG/JPEG)</label>
              <input type="file" onChange={(e) => setDocument(e.target.files[0])} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ✅ Main Render
  return (
    <div className="add-employee-container">
      <Sidebar />
      <div className="add-employee-content">
        <h1>Edit Employee</h1>

        <div className="stepper">
          {["Personal", "Official", "Next of Kin", "Bank", "Documents"].map(
            (label, index) => (
              <div key={label} className={`step ${step === index + 1 ? "active" : ""}`}>
                <span>{index + 1}</span> {label}
              </div>
            )
          )}
        </div>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSave}>
          {renderStep()}
          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="cancel-btn" onClick={prevStep}>
                Previous
              </button>
            )}
            {step < 5 && (
              <button type="button" className="submit-btn" onClick={nextStep}>
                Next
              </button>
            )}
            {step === 5 && (
              <button type="submit" className="submit-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
            <button type="button" className="btn-danger" onClick={handleDelete}>
              Delete
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/employee-info")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
