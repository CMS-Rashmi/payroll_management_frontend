import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/ViewEmployee.css";
import { apiGet } from "../services/api";

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet(`/employees/${id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load employee details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="loading">Loading employee details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!employee) return <div>No employee data found.</div>;

  return (
    <div className="view-employee-container">
      <Sidebar />
      <div className="view-employee-content">
        <div className="header">
          <h1>Registered Member Profile</h1>
        </div>

        <div className="employee-profile-card">
          <div className="profile-left">
            <div className="profile-photo">
              {employee.profilePhoto ? (
                <img src={employee.profilePhoto} alt="Profile" />
              ) : (
                <div className="profile-placeholder">👤</div>
              )}
            </div>
            <h3>{`${employee.first_name} ${employee.last_name}`}</h3>
            <p>{employee.preferred_name}</p>
            <div className="profile-details">
              <p><strong>Email:</strong> {employee.email}</p>
              <p><strong>Contact:</strong> {employee.country_code} {employee.phone}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`status-toggle ${
                    employee.status === "Active" ? "active" : "inactive"
                  }`}
                >
                  {employee.status}
                </span>
              </p>
            </div>
          </div>

          <div className="profile-right">
            {/* Tabs */}
            <div className="tab-buttons">
              {[
                { key: "personal", label: "Personal" },
                { key: "official", label: "Official" },
                { key: "kin", label: "Next of Relatives" },
                { key: "bank", label: "Bank & Documents" },
                { key: "documents", label: "Personal Documents" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={activeTab === tab.key ? "active" : ""}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === "personal" && (
                <div className="details-grid">
                  <div><label>Employee No</label><p>{employee.id}</p></div>
                  <div><label>Full Name</label><p>{`${employee.first_name} ${employee.last_name}`}</p></div>
                  <div><label>Initials</label><p>{employee.initials}</p></div>
                  <div><label>Preferred Name</label><p>{employee.preferred_name}</p></div>
                  <div><label>NIC</label><p>{employee.nic}</p></div>
                  <div><label>Date of Birth</label><p>{employee.dob}</p></div>
                  <div><label>Gender</label><p>{employee.gender}</p></div>
                  <div><label>Marital Status</label><p>{employee.marital_status}</p></div>
                  <div><label>Permanent Address</label><p>{employee.address_permanent}</p></div>
                  <div><label>Temporary Address</label><p>{employee.address_temporary}</p></div>
                  <div><label>Nationality</label><p>{employee.nationality}</p></div>
                  <div><label>Religion</label><p>{employee.religion}</p></div>
                </div>
              )}

              {activeTab === "official" && (
                <div className="details-grid">
                  <div><label>Department</label><p>{employee.department}</p></div>
                  <div><label>Designation</label><p>{employee.designation}</p></div>
                  <div><label>Working Office</label><p>{employee.working_office}</p></div>
                  <div><label>Branch</label><p>{employee.branch}</p></div>
                  <div><label>Employment Type</label><p>{employee.employment_type}</p></div>
                  <div><label>Appointment Date</label><p>{employee.appointment_date}</p></div>
                  <div><label>Supervisor</label><p>{employee.supervisor}</p></div>
                  <div><label>Basic Salary</label><p>{employee.basic_salary}</p></div>
                  <div><label>Grade</label><p>{employee.grade}</p></div>
                  <div><label>EPF No</label><p>{employee.epf_no}</p></div>
                </div>
              )}

              {activeTab === "kin" && (
                <div className="details-grid">
                  <div><label>Relatives Name</label><p>{employee.kin_name}</p></div>
                  <div><label>Relationship</label><p>{employee.kin_relationship}</p></div>
                  <div><label>NIC</label><p>{employee.kin_nic}</p></div>
                  <div><label>Date of Birth</label><p>{employee.kin_dob}</p></div>
                </div>
              )}

              {activeTab === "bank" && (
                <div className="details-grid">
                  <div><label>Account Name</label><p>{employee.account_name}</p></div>
                  <div><label>Account Number</label><p>{employee.account_number}</p></div>
                  <div><label>Bank</label><p>{employee.bank_name}</p></div>
                  <div><label>Branch</label><p>{employee.branch_name}</p></div>
                  <div><label>Bank Document</label><p>{employee.bankDocument ? "Uploaded" : "No document uploaded"}</p></div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="details-grid">
                  <div><label>Document Type</label><p>{employee.document_type}</p></div>
                  <div>
                    <label>Document</label>
                    {employee.documents ? (
                      <a
                        href={employee.documents}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="doc-link"
                      >
                        View Document
                      </a>
                    ) : (
                      <p>No documents uploaded</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;


