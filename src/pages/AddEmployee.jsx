import React, { useState } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import { apiUpload } from "../services/api";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

export default function AddEmployee() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "", last_name: "", initials: "", calling_name: "",
    email: "", personal_email: "", country_code: "+94", phone: "",
    gender: "", dob: "", marital_status: "", nationality: "", religion: "",
    nic: "", address_permanent: "", address_temporary: "",
    appointment_date: "", department: "", designation: "", working_office: "",
    branch: "", employment_type: "", basic_salary: "", status: "Active",
    supervisor: "", grade: "", designated_emails: "", epf_no: "",
    kin_name: "", relationship: "", kin_nic: "", kin_dob: "",
    account_number: "", account_name: "", bank_name: "", branch_name: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [bankDocument, setBankDocument] = useState(null);
  const [documentType, setDocumentType] = useState("");

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
    if (document && !["application/pdf", "image/jpeg", "image/jpg"].includes(document.type)) {
      setError("Document must be PDF/JPG/JPEG.");
      return false;
    }
    if (document && !documentType) {
      setError("Please select a document type for your uploaded file.");
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
      Object.entries(formData).forEach(([key, value]) => fd.append(key, value));
      if (profilePhoto) fd.append("profilePhoto", profilePhoto);
      if (document) fd.append("documents", document);
      if (bankDocument) fd.append("bankDocument", bankDocument);
      fd.append("document_type", documentType);
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

  const L = ({ children }) => (
    <div className="card">
      {children}
    </div>
  );

  const Field = (props) => <input className="input" {...props} />;
  const Select = (props) => <select className="select" {...props} />;

  const StepHeader = ({ title, sub }) => (
    <>
      <h2 style={{ margin: 0 }}>{title}</h2>
      {sub && <div style={{ color: "var(--muted)", marginTop: 4 }}>{sub}</div>}
      <div style={{ height: 12 }} />
    </>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <L>
            <StepHeader title="Personal Details" sub="Enter employee personal details" />
            <div className="grid-2">
              <Field name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleInputChange} required />
              <Field name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleInputChange} required />
              <Field name="initials" placeholder="Initials" value={formData.initials} onChange={handleInputChange} />
              <Field name="calling_name" placeholder="Preferred Name" value={formData.calling_name} onChange={handleInputChange} />
              <div>
                <PhoneInput
                  country={"lk"}
                  value={formData.phone}
                  onChange={(phone, countryData) =>
                    setFormData((prev) => ({ ...prev, phone, country_code: `+${countryData.dialCode}` }))
                  }
                  inputStyle={{ width: "100%", height: "42px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
                  dropdownStyle={{ borderRadius: 6, fontSize: 14 }}
                />
              </div>
              <Select name="gender" value={formData.gender} onChange={handleInputChange} required>
                <option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option>
              </Select>
              <Select name="marital_status" value={formData.marital_status} onChange={handleInputChange} required>
                <option value="">Select Marital Status</option><option>Married</option><option>Unmarried</option>
              </Select>
              <Field type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
              <Field name="nic" placeholder="NIC Number" value={formData.nic} onChange={handleInputChange} />
              <Field name="email" type="email" placeholder="Work Email" value={formData.email} onChange={handleInputChange} required />
              <Field name="personal_email" type="email" placeholder="Personal Email" value={formData.personal_email} onChange={handleInputChange} />
              <Field name="address_permanent" placeholder="Permanent Address" value={formData.address_permanent} onChange={handleInputChange} />
              <Field name="address_temporary" placeholder="Temporary Address" value={formData.address_temporary} onChange={handleInputChange} />
              <Select name="nationality" value={formData.nationality} onChange={handleInputChange}>
                <option value="">Select Nationality</option><option>Sri Lankan</option><option>Indian</option><option>Other</option>
              </Select>
              <Select name="religion" value={formData.religion} onChange={handleInputChange}>
                <option value="">Select Religion</option><option>Buddhism</option><option>Hinduism</option><option>Christianity</option><option>Islam</option>
              </Select>
            </div>
          </L>
        );
      case 2:
        return (
          <L>
            <StepHeader title="Official Details" sub="Enter employee official details" />
            <div className="grid-2">
              <Field type="date" name="appointment_date" value={formData.appointment_date} onChange={handleInputChange} />
              <Select name="department" value={formData.department} onChange={handleInputChange}>
                <option value="">Select Department</option>
                <option>IT</option><option>Finance</option><option>HR</option><option>Sales</option><option>Admin</option>
              </Select>
              <Select name="designation" value={formData.designation} onChange={handleInputChange}>
                <option value="">Select Designation</option>
                <option>Executive</option><option>Manager</option><option>Assistant</option><option>Officer</option>
              </Select>
              <Select name="working_office" value={formData.working_office} onChange={handleInputChange}>
                <option value="">Select Working Office</option><option>Head Office</option><option>Branch Office</option>
              </Select>
              <Select name="branch" value={formData.branch} onChange={handleInputChange}>
                <option value="">Select Branch</option><option>Colombo</option><option>Kandy</option><option>Galle</option><option>Jaffna</option>
              </Select>
              <Select name="employment_type" value={formData.employment_type} onChange={handleInputChange}>
                <option value="">Select Employment Type</option><option>Permanent</option><option>Contract</option><option>Temporary</option><option>Probation</option>
              </Select>
              <Field type="number" name="basic_salary" placeholder="Basic Salary" value={formData.basic_salary} onChange={handleInputChange} />
              <Select name="status" value={formData.status} onChange={handleInputChange}>
                <option>Active</option><option>Inactive</option>
              </Select>
              <Select name="grade" value={formData.grade} onChange={handleInputChange}>
                <option value="">Select Grade</option><option>A</option><option>B</option><option>C</option>
              </Select>
              <Select name="supervisor" value={formData.supervisor} onChange={handleInputChange}>
                <option value="">Select Supervisor</option><option>Manager</option><option>HR Head</option><option>Director</option>
              </Select>
              <Field name="designated_emails" placeholder="Designated emails (comma separated)" value={formData.designated_emails} onChange={handleInputChange} />
              <Field name="epf_no" placeholder="EPF Number" value={formData.epf_no} onChange={handleInputChange} />
            </div>
          </L>
        );
      case 3:
        return (
          <L>
            <StepHeader title="Relatives Details" />
            <div className="grid-2">
              <Field name="kin_name" placeholder="Name" onChange={handleInputChange} />
              <Field name="relationship" placeholder="Relationship" onChange={handleInputChange} />
              <Field name="kin_nic" placeholder="NIC" onChange={handleInputChange} />
              <Field type="date" name="kin_dob" placeholder="DOB" onChange={handleInputChange} />
            </div>
          </L>
        );
      case 4:
        return (
          <L>
            <StepHeader title="Bank Details" sub="Enter Employee Bank Details" />
            <div className="grid-2">
              <Field name="account_number" placeholder="Account Number" value={formData.account_number} onChange={handleInputChange} />
              <Field name="account_name" placeholder="Account Name" value={formData.account_name} onChange={handleInputChange} />
              <Select name="bank_name" value={formData.bank_name} onChange={handleInputChange}>
                <option value="">Select Bank</option>
                <option>Bank of Ceylon</option><option>People's Bank</option><option>Commercial Bank</option>
                <option>Hatton National Bank</option><option>Sampath Bank</option><option>DFCC Bank</option><option>NDB Bank</option>
              </Select>
              <Select name="branch_name" value={formData.branch_name} onChange={handleInputChange}>
                <option value="">Select Branch</option><option>Colombo</option><option>Kandy</option><option>Galle</option><option>Matara</option><option>Kurunegala</option>
              </Select>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                Upload Bank Document (Optional)
              </label>
              <input className="input" type="file" onChange={(e) => setBankDocument(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </L>
        );
      case 5:
        return (
          <L>
            <StepHeader title="Documents Upload" sub="Upload profile photo and a supporting document" />
            <div>
              <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                Profile Photo (JPG/JPEG/PNG)
              </label>
              <input className="input" type="file" onChange={(e) => setProfilePhoto(e.target.files[0])} accept=".jpg,.jpeg,.png" />
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
                Document Type
              </label>
              <select className="select" value={documentType} onChange={(e) => setDocumentType(e.target.value)} required>
                <option value="">Select Document Type</option>
                <option>NIC Copy</option><option>Birth Certificate</option><option>Educational Certificates</option>
                <option>Appointment Letter</option><option>Experience Letter</option><option>Passport Copy</option><option>Other</option>
              </select>

              <label style={{ display: "block", fontSize: 12, color: "var(--muted)", margin: "10px 0 6px" }}>
                Upload Supporting Document (PDF/JPG/JPEG)
              </label>
              <input className="input" type="file" onChange={(e) => setDocument(e.target.files[0])} accept=".pdf,.jpg,.jpeg" />
            </div>
          </L>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      {/* Fixed Header Section */}
      <div style={{ flexShrink: 0 }}>
        <PageHeader breadcrumb={["Employee Information", "Member Registration"]} title="Member Registration" />

        {/* Fixed Stepper Tabs */}
        <div className="card" style={{ 
          display: "flex", 
          gap: "8px", 
          overflowX: "auto",
          whiteSpace: "nowrap",
          marginBottom: "16px",
          flexShrink: 0
        }}>
          {["Personal Details", "Official Details", "Relatives Details", "Bank Details", "Personal Documents"].map(
            (label, index) => (
              <button
                key={label}
                className={`btn ${step === index + 1 ? "btn-primary" : "btn-soft"}`}
                type="button"
                onClick={() => setStep(index + 1)}
                style={{ whiteSpace: "nowrap", flexShrink: 0 }}
              >
                {index + 1}. {label}
              </button>
            )
          )}
        </div>

        {error && <div className="card" style={{ borderColor: "var(--danger)", color: "var(--danger)", marginBottom: "16px", flexShrink: 0 }}>{error}</div>}
      </div>

      {/* Scrollable Form Content */}
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        <form onSubmit={handleSubmit} style={{ height: "100%" }}>
          {renderStep()}
          <div style={{ height: 16 }} />
          <div style={{ display: "flex", gap: 8, paddingBottom: "20px" }}>
            {step > 1 && (
              <button type="button" className="btn btn-soft" onClick={prevStep}>
                Previous
              </button>
            )}
            {step < 5 && (
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Save & Next
              </button>
            )}
            {step === 5 && (
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}