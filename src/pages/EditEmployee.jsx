// src/pages/EditEmployee.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/AddEmployee.css";
import { apiGet, apiUpload, apiDelete } from "../services/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const DocCard = ({ doc, onReplace, onDelete, busyId }) => (
  <li className="doc-card">
    <div className="thumb">
      {doc.kind === "image" ? (
        <img src={doc.url} alt={doc.file_name} />
      ) : doc.kind === "pdf" ? (
        <iframe src={`${doc.url}#view=FitH&navpanes=0&toolbar=0`} title={doc.file_name} />
      ) : (
        <div className="file-icon">📄</div>
      )}
    </div>
    <div className="meta">
      <div className="name" title={doc.file_name}>{doc.file_name}</div>
      <div className="type">
        <strong>{doc.category}</strong> • {doc.file_type}
      </div>
      <div className="actions">
        <a className="doc-link" href={doc.url} target="_blank" rel="noopener noreferrer">View/Download</a>
        <button className="doc-act" onClick={() => onReplace(doc)} disabled={busyId===doc.id}>Replace</button>
        <button className="doc-act danger" onClick={() => onDelete(doc)} disabled={busyId===doc.id}>Delete</button>
      </div>
    </div>
  </li>
);

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyDoc, setBusyDoc] = useState(null);
  const [error, setError] = useState("");

  const [existingDocs, setExistingDocs] = useState([]);
  const [existingBankDocs, setExistingBankDocs] = useState([]);

  const [formData, setFormData] = useState({
    first_name: "", last_name: "", initials: "", calling_name: "",
    email: "", personal_email: "", country_code: "+94", phone: "",
    gender: "", dob: "", marital_status: "", nationality: "", religion: "", nic: "",
    address_permanent: "", address_temporary: "",
    appointment_date: "", department: "", designation: "",
    working_office: "", branch: "", employment_type: "",
    basic_salary: "", status: "Active", supervisor: "", grade: "", designated_emails: "", epf_no: "",
    kin_name: "", kin_relationship: "", kin_nic: "", kin_dob: "",
    account_number: "", account_name: "", bank_name: "", branch_name: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [bankDocument, setBankDocument] = useState(null);
  const [documentType, setDocumentType] = useState("");

  const replaceInputRef = useRef(null);
  const replaceTargetRef = useRef(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await apiGet(`/employees/${id}`);
        const e = res.data || {};

        setFormData(prev => ({
          ...prev,
          first_name: e.first_name || "",
          last_name: e.last_name || "",
          initials: e.initials || "",
          calling_name: e.calling_name || "",
          email: e.email || "",
          personal_email: e.personal_email || "",
          country_code: e.country_code || "",
          phone: e.phone || "",
          gender: e.gender || "",
          dob: e.dob || "",
          marital_status: e.marital_status || "",
          nationality: e.nationality || "",
          religion: e.religion || "",
          nic: e.nic || "",
          address_permanent: e.address_permanent || "",
          address_temporary: e.address_temporary || "",
          appointment_date: e.appointment_date || "",
          department: e.department_name || "",
          designation: e.designation || "",
          working_office: e.working_office || "",
          branch: e.branch || "",
          employment_type: e.employment_type || "",
          basic_salary: e.basic_salary ?? "",
          status: e.status || "Active",
          supervisor: e.supervisor || "",
          grade: e.grade || "",
          designated_emails: e.designated_emails || "",
          epf_no: e.epf_no || "",
          kin_name: e.kin?.kin_name || "",
          kin_relationship: e.kin?.relationship || "",
          kin_nic: e.kin?.kin_nic || "",
          kin_dob: e.kin?.kin_dob || "",
          account_number: e.bank_account?.account_number || "",
          account_name: e.bank_account?.account_name || "",
          bank_name: e.bank_account?.bank_name || "",
          branch_name: e.bank_account?.branch_name || "",
        }));

        const docs = e.documents || [];
        setExistingBankDocs(docs.filter(d => d.category === 'Bank Document' || d.file_name?.startsWith('BANK -')));
        setExistingDocs(docs.filter(d => !(d.category === 'Bank Document' || d.file_name?.startsWith('BANK -'))));
      } catch (err) {
        console.error(err);
        setError("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const validateFiles = () => {
    if (profilePhoto && !["image/jpeg", "image/jpg", "image/png"].includes(profilePhoto.type)) {
      setError("Profile photo must be JPG/JPEG/PNG.");
      return false;
    }
    if (document && !["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(document.type)) {
      setError("Document must be PDF/JPG/JPEG/PNG.");
      return false;
    }
    return true;
  };

  const refreshDocs = async () => {
    const fresh = await apiGet(`/employees/${id}`);
    const docs = fresh.data.documents || [];
    setExistingBankDocs(docs.filter(d => d.category === 'Bank Document' || d.file_name?.startsWith('BANK -')));
    setExistingDocs(docs.filter(d => !(d.category === 'Bank Document' || d.file_name?.startsWith('BANK -'))));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateFiles()) return;
    setSaving(true);
    setError("");

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v ?? ""));
      if (profilePhoto) fd.append("profilePhoto", profilePhoto);
      if (document) fd.append("documents", document);
      if (bankDocument) fd.append("bankDocument", bankDocument);
      if (document) fd.append("document_type", documentType || "Other");

      await apiUpload(`/employees/${id}`, fd, "PUT");
      await refreshDocs();
      setDocument(null);
      setBankDocument(null);
      alert("Employee updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  // Delete & Replace handlers
  const handleDeleteDoc = async (doc) => {
    if (!window.confirm(`Delete "${doc.file_name}"?`)) return;
    try {
      setBusyDoc(doc.id);
      await apiDelete(`/employees/${id}/documents/${doc.id}`);
      await refreshDocs();
    } catch (e) {
      console.error(e);
      alert("Failed to delete document");
    } finally {
      setBusyDoc(null);
    }
  };

  const handleReplaceDoc = (doc) => {
    replaceTargetRef.current = doc;
    replaceInputRef.current?.click();
  };

  const onPickReplacement = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const okTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!okTypes.includes(file.type)) {
      alert("File must be PDF/JPG/JPEG/PNG.");
      return;
    }

    const doc = replaceTargetRef.current;
    if (!doc) return;

    try {
      setBusyDoc(doc.id);
      const fd = new FormData();
      fd.append("file", file);
      await apiUpload(`/employees/${id}/documents/${doc.id}`, fd, "PUT");
      await refreshDocs();
    } catch (e2) {
      console.error(e2);
      alert("Failed to replace document");
    } finally {
      setBusyDoc(null);
      replaceTargetRef.current = null;
    }
  };

  if (loading) return <div className="edit-loading">Loading…</div>;

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
              <input name="calling_name" placeholder="Preferred Name" value={formData.calling_name} onChange={handleInputChange} />
              <PhoneInput
                country={"lk"}
                value={formData.phone}
                onChange={(phone, countryData) =>
                  setFormData((prev) => ({ ...prev, phone, country_code: `+${countryData.dialCode}` }))
                }
                inputStyle={{ width: "100%", height: "42px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px" }}
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
                <option value="IT">IT</option>
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
            <h2>Relatives Details</h2>
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

            <div className="upload-box" style={{ marginTop: 20 }}>
              <label>Existing Bank Documents</label>
              {existingBankDocs.length ? (
                <ul className="doc-grid">
                  {existingBankDocs.map(d => (
                    <DocCard key={d.id} doc={d} onReplace={handleReplaceDoc} onDelete={handleDeleteDoc} busyId={busyDoc} />
                  ))}
                </ul>
              ) : <p>No bank document uploaded</p>}
            </div>

            <div className="upload-box" style={{ marginTop: 20 }}>
              <label>Upload Bank Document (Optional)</label>
              <input type="file" onChange={(e) => setBankDocument(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="step-section">
            <h2>Documents Upload</h2>
            <p className="section-subtitle">Upload and manage personal documents</p>

            <div className="upload-box">
              <label>Already Uploaded Documents</label>
              {existingDocs.length ? (
                <ul className="doc-grid">
                  {existingDocs.map(d => (
                    <DocCard key={d.id} doc={d} onReplace={handleReplaceDoc} onDelete={handleDeleteDoc} busyId={busyDoc} />
                  ))}
                </ul>
              ) : <p>No personal documents uploaded</p>}
            </div>

            <div className="upload-box" style={{ marginTop: 20 }}>
              <label>Profile Photo (JPG/JPEG/PNG)</label>
              <input type="file" onChange={(e) => setProfilePhoto(e.target.files[0])} accept=".jpg,.jpeg,.png" />
            </div>

            <div className="upload-box" style={{ marginTop: 20 }}>
              <label>Select Document Type</label>
              <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                <option value="">Select Document Type</option>
                <option value="NIC Copy">NIC Copy</option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Educational Certificates">Educational Certificates</option>
                <option value="Appointment Letter">Appointment Letter</option>
                <option value="Experience Letter">Experience Letter</option>
                <option value="Passport Copy">Passport Copy</option>
                <option value="Other">Other</option>
              </select>
              <label style={{ marginTop: 10 }}>Upload Supporting Document (PDF/JPG/JPEG/PNG)</label>
              <input type="file" onChange={(e) => setDocument(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="add-employee-container">
      <Sidebar />
      <div className="add-employee-content">
        <h1>Edit Employee</h1>

        <div className="stepper">
          {["Personal", "Official", "Next of Kin", "Bank", "Documents"].map((label, index) => (
            <div key={label} className={`step ${step === index + 1 ? "active" : ""}`}>
              <span>{index + 1}</span> {label}
            </div>
          ))}
        </div>

        {error && <p className="error-text">{error}</p>}

        {/* hidden input for "Replace" */}
        <input
          ref={replaceInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          onChange={onPickReplacement}
        />

        <form onSubmit={handleSave}>
          {renderStep()}
          <div className="form-actions">
            {step > 1 && <button type="button" className="cancel-btn" onClick={prevStep}>Previous</button>}
            {step < 5 && <button type="button" className="submit-btn" onClick={nextStep}>Next</button>}
            {step === 5 && <button type="submit" className="submit-btn" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>}
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                if (window.confirm('Delete this employee?')) {
                  apiGet(`/employees/${id}`, { method: 'DELETE' })
                    .then(() => { alert('Employee deleted'); navigate('/employee-info'); })
                    .catch(() => alert('Failed to delete employee'));
                }
              }}
            >
              Delete
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/employee-info")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
